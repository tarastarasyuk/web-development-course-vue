const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://swapi.dev',
    changeOrigin: true,
    secure: false,
}));

app.listen(8123);
