var http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type' : "text/plain"});
    response.end('{"led" : true}');
}).listen(8080);
console.log("Server is running at http://127.0.0.1:8080/")