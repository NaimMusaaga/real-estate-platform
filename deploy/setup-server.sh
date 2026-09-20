#!/usr/bin/env bash
# One-time provisioning of a fresh Ubuntu 22.04 VM (Oracle Cloud Always Free) for logai.
#
#   bash setup-server.sh <domain> <email-for-letsencrypt>
#   e.g. bash setup-server.sh logai.duckdns.org me@example.com
#
# Installs Nginx, MariaDB, Node 20, PM2; creates the database and .env; builds the
# frontend; starts the API under PM2; and issues a free Let's Encrypt certificate.
# Run as the default (non-root) user — it uses sudo where needed.
set -euo pipefail

DOMAIN="${1:?usage: setup-server.sh <domain> <email>}"
LE_EMAIL="${2:?usage: setup-server.sh <domain> <email>}"
REPO_URL="https://github.com/NaimMusaaga/real-estate-platform.git"
APP_DIR="/opt/logai"
DB_NAME="real_estate"
DB_USER="logai"

if [ -f "$APP_DIR/backend/.env" ]; then
  echo "$APP_DIR/backend/.env already exists — this script is for first-time setup only." >&2
  echo "Use deploy/update.sh to ship new versions." >&2
  exit 1
fi

echo "==> Swap (the free 1 GB VM can run out of memory while building the frontend)"
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "==> System packages"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  nginx mariadb-server git curl ca-certificates certbot python3-certbot-nginx iptables-persistent

echo "==> Node.js 20 + PM2"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2

echo "==> Open ports 80/443 in the OS firewall (Oracle's Ubuntu image blocks them by default)"
for port in 80 443; do
  sudo iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null \
    || sudo iptables -I INPUT 1 -p tcp --dport "$port" -j ACCEPT
done
sudo netfilter-persistent save

echo "==> Database"
DB_PASSWORD="$(openssl rand -hex 16)"
sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "==> Application code"
sudo mkdir -p "$APP_DIR"
sudo chown "$USER":"$USER" "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"

JWT_SECRET="$(openssl rand -hex 32)"
ADMIN_PASSWORD="$(openssl rand -base64 12 | tr -d '/+=' | cut -c1-14)Aa1!"
cat > "$APP_DIR/backend/.env" <<ENV
PORT=4000
NODE_ENV=production
CLIENT_URL=https://$DOMAIN

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=1d

EMAIL_MODE=console
UPLOAD_DIR=uploads

ADMIN_EMAIL=admin@$DOMAIN
ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV
chmod 600 "$APP_DIR/backend/.env"

echo "==> Backend"
cd "$APP_DIR/backend"
mkdir -p uploads
npm ci --omit=dev
npm run migrate
npm run seed:reference
npm run seed:admin

echo "==> Frontend build"
cd "$APP_DIR/frontend"
npm ci
npm run build   # uses frontend/.env.production (same-origin API + socket)

echo "==> Nginx"
sudo sed "s/__DOMAIN__/$DOMAIN/g" "$APP_DIR/deploy/nginx.conf" | sudo tee /etc/nginx/sites-available/logai >/dev/null
sudo ln -sf /etc/nginx/sites-available/logai /etc/nginx/sites-enabled/logai
sudo rm -f /etc/nginx/sites-enabled/default
# Nginx (www-data) must be able to traverse to the built files and uploads.
sudo chmod o+x /opt "$APP_DIR"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Start the API under PM2 (auto-restart on crash and on reboot)"
cd "$APP_DIR"
pm2 start deploy/ecosystem.config.js
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME"

echo "==> HTTPS certificate (needs the domain to already point at this server)"
sudo certbot --nginx -d "$DOMAIN" -m "$LE_EMAIL" --agree-tos --non-interactive --redirect

echo
echo "Done. Site:  https://$DOMAIN"
echo "Admin login: admin@$DOMAIN"
echo "Admin pass:  $ADMIN_PASSWORD   (change it after first login — it is also stored in $APP_DIR/backend/.env)"
