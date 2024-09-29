// Server.js
const express = require('express');
const routes = require('./routes') // Import routes

const app = express();
const PORT = process.env.PORT || 5000;

// Use the routes from routes/index.js
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;