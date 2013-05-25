
var http = require("http");
var requestHandler = require("./request-handler");

var requestListener = function (request, response) {
  var body = null;

  console.log("Serving request type " + request.method + " for url " + request.url);

  requestHandler.handleRequest(request, response);

  response.end(body);
};

var port = 8080;

var ip = "127.0.0.1";

var server = http.createServer(requestListener);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

