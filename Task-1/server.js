const express = require('express')
const app = express();

const config = require('./config/config');
const routes = require('./config/routes');

// Use routes
app.use('/', routes);

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`));

module.exports = app;