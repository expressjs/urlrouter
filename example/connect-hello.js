var connect = require('connect');
var urlrouter = require('../');

connect(urlrouter(function (app) {
  app.get('/', function (req, res, next) {
    res.end('hello urlrouter');
  });
  app.get('/user/:id([0-9]+)', function (req, res, next) {
    res.end('hello user ' + req.params.id);
  });
})).listen(3000);