var connect = require('connect');
var urlrouter = require('../');

connect(urlrouter(function (app) {
  app.get('/', function (req, res, next) {
    res.end('hello urlrouter');
  });
})).listen(3000);