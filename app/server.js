// prepare
process.env.NODE_ENV = 'production';

// dependencies
const http = require('http');
const path = require('path');
const express = require('express');

const PORT = 30000;
const app = express();

// configure
app.set('env', process.env.NODE_ENV);
app.disable('x-powered-by');
app.disable('etag');
app.set('trust proxy', 0);
app.set('case sensitive routing', true);
app.set('strict routing', true);

// run server
const server = http.Server(app);
server.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Server started on localhost:${PORT}`);
});

const io = require('./socket')(server);
app.set('io', io);

