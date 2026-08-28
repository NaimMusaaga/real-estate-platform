const express = require('express');
const path = require('path');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', env.upload.dir)));
app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
