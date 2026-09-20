// PM2 process definition — used by setup-server.sh and update.sh.
module.exports = {
  apps: [
    {
      name: 'logai-api',
      cwd: '/opt/logai/backend',
      script: 'src/server.js',
      instances: 1, // Socket.IO presence/rate-limit state is in-memory, so keep a single instance
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
