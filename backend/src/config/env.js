require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'real_estate',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSizeMb: 5,
    maxPhotosPerListing: 8,
  },
  email: {
    mode: process.env.EMAIL_MODE || 'console',
  },
  mailtrap: {
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT) || 587,
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
};
