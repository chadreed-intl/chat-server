// Import node's http module
var http = require('http');

// Import request handler
var handler = require('./request-handler');

// Use the port provided in the environment variable PORT or 8080
var port = process.env.PORT || 8080;

// Create the server
var server = http.createServer(handler);
server.listen(port);

console.log('Chat server started on port '+port);
