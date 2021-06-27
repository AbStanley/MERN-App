const config = require('../config');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// ****************************************************************************
// Middleware registration / Router mounting

// Middleware that logs requests/responses in console
app.use(morgan(config.morgan.format, config.morgan.options));

// Middleware that parses requests with JSON body
app.use(express.json());

// Middleware that implements CORS for Pokemon API
app.use(config.pokemonAPI.path, cors());

// Mount Pokemon API router
app.use(config.pokemonAPI.path, require('./api/pokemon'));

// Middleware that looks for static files
app.use(express.static('./static'));

// ****************************************************************************

// Set app to send JSON in indented format for easy reading in browser
app.set('json spaces', 2);

module.exports = app;
