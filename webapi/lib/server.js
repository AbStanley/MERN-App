const app = require('./app');
const config = require('./config');

// Start server
app.listen(
    config.port, 
    () => console.log(`Listening on port ${config.port}`)
);

