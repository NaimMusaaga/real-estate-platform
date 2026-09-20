# Deployment — Oracle Cloud Always Free

Zero-cost, single-VM deployment matching [system-architecture.md](system-architecture.md): Nginx (TLS, static SPA, `/uploads`, reverse proxy) → Node/Express + Socket.IO under PM2 → MariaDB, all on one Ubuntu 22.04 VM.

Everything below the "Provision" section is scripted in [`deploy/`](../deploy).

## 1. Provision (manual, in the Oracle console)

1. Create an Oracle Cloud account (the card is only for identity verification; Always Free resources are not billed). Pick a home region carefully — it cannot be changed later.
2. **Compute → Instances → Create instance**
   - Image: **Canonical Ubuntu 22.04**
   - Shape: **VM.Standard.A1.Flex** (ARM, 1 OCPU / 6 GB RAM is plenty) — or `VM.Standard.E2.1.Micro` if A1 capacity is unavailable in your region.
   - Networking: assign a **public IPv4**.
   - SSH keys: let Oracle generate a pair and **download the private key**.
3. **Networking → your VCN → Security List → Add Ingress Rules**: source `0.0.0.0/0`, TCP, destination ports `80` and `443`.
4. Reserve the public IP (so it survives a stop/start) and note it.

## 2. Free domain

Let's Encrypt needs a hostname. [duckdns.org](https://www.duckdns.org) gives a free one: create `something.duckdns.org` and point it at the VM's public IP.

## 3. Install

```bash
ssh -i <key> ubuntu@<public-ip>
curl -fsSLO https://raw.githubusercontent.com/NaimMusaaga/real-estate-platform/main/deploy/setup-server.sh
bash setup-server.sh something.duckdns.org you@example.com
```

The script prints the admin credentials at the end (also stored in `/opt/logai/backend/.env`, mode 600). Secrets (DB password, JWT secret) are generated on the server and never committed.

## 4. Shipping updates

```bash
ssh -i <key> ubuntu@<public-ip> "bash /opt/logai/deploy/update.sh"
```

## Notes

- `EMAIL_MODE=console`: no outbound mail is configured, so verification links only appear in `pm2 logs logai-api`. Login does not require verification (see README).
- The API is deliberately a single PM2 instance — presence and rate-limit state live in process memory.
- Backups: `mysqldump real_estate` and the `backend/uploads/` folder are the only state.
