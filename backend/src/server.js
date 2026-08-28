const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { initSocketServer } = require('./sockets');

const server = http.createServer(app);
initSocketServer(server, env.clientUrl);

server.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
