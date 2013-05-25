
var storage = [];

var storeMessage = function(data){
  data.createdAt = new Date().toISOString();
  storage.push(data);
};

var handleRequest = function(request, response ) {
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  
  headers['Content-Type'] = "text/plain";

  //HANDLE GET or OPTIONS
  if(request.method === 'GET' || request.method === 'OPTIONS'){
    switch (request.url) {
      case '/classes/messages':
        var result = {
          results: storage
        };
        headers['Content-Type'] = "application/json";
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(result));
        break;

      default:
        statusCode = 404;
        break;
    }
  }

  //HANDLE POST
  if(request.method === 'POST'){
  	var postData = '';
    statusCode = 302;

    request.on('data', function(data){
      postData += data;
    });

    request.on('end', function(){
      storeMessage(JSON.parse(postData));
    });
  }
  response.writeHead(statusCode, headers);

// Hold messages in memory
var messages = [];

// Every response should come back with these headers
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds
  'Content-Type': 'application/json'
};

// Send some JSON to the client
var sendJSON = function(res, obj, status) {
  status = status || 200;

  // Send status/headers
  res.writeHead(status, headers);

  // Send body
  res.end(JSON.stringify(obj));
};

// Send an error to the client
var sendError = function(res, message, status) {
  sendJSON(res, {
    status: 1,
    message: message
  }, status || 400);
};

// Get the body from a request readable stream
var getRequestBody = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function(chunk) {
    callback(data);
  });
};

module.exports = function(req, res) {
  switch (req.method) {

    case 'GET':
      // Return all messages
      sendJSON(res, {
        results: messages
      });
      break;

    case 'POST':
      // Read message content
      getRequestBody(req, function(data) {
        try {
          // Parse message
          var message = JSON.parse(data);

          // Validate message content
          if (message.username && message.text) {
            // Give it an ObjectId
            message.objectId = messages.length+1;

            // Store message
            messages.push(message);

            // Log message on server-side
            console.log(message.username+': '+message.text);

            // Send response
            sendJSON(res, {
              status: 0,
              message: 'Message recieved'
            });
          }
          else {
           sendError(res, 'Missing required fields username and text', 400);
          }
        }
        catch(err) {
          console.log(err);
          sendError(res, 'Malformed JSON', 400);
        }
      });

      break;

    case 'OPTIONS':
      sendJSON(res, {});

    default:
      sendError(res, req.method+' method not implemented', 501);
      break;
  }
};



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;
