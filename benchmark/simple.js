var http = require('http');
var urlparse = require('url').parse;
var connect = require('connect');
var urlrouter = require('../');

// http://nodejs.org/docs/latest/api/synopsis.html
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);

http.createServer(urlrouter(function (app) {
  app.get('/', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
  });
  app.get('/user/:id', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
  });
})).listen(8125);

connect(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8126);

connect(urlrouter(function (app) {
  app.get('/', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
  });
})).listen(8127);

// $ siege --benchmark --concurrent=50 --time=10S --log=./siege.log http://127.0.0.1:8124/