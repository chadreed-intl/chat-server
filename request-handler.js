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
};



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;
