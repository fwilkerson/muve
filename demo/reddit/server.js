const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const {join} = require('path');

const server = express();
const port = process.env.PORT || 3000;

server.use(compression());
server.use(helmet());
server.use(express.static(join(__dirname, 'public')));

server.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

server.listen(port);
