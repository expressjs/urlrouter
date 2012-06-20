/*!
 * urlrouter.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var urlparse = require('url').parse;
var utils = require('./utils');

var METHODS = ['get', 'post', 'put', 'delete', 'head', 'options'];

function notFound(req, res) {
  res.statusCode = 404;
  res.end(req.method !== 'HEAD' && req.method + ' ' + req.url + ' Not Found ');
}

function router(fn, options) {
  var routes = [];
  var methods = {};
  options = options || {};
  options.paramsName = options.paramsName || 'params';

  function createMethod(name) {
    var localRoutes = routes[name.toUpperCase()] = [];
    return function (urlroute, fn) {
      localRoutes.push([utils.createRouter(urlroute), fn]);
    };
  }

  METHODS.forEach(function (method) {
    methods[method] = createMethod(method);
  });

  fn(methods);

  return function lookup(req, res, next) {
    var method = req.method.toUpperCase();
    var localRoutes = routes[method];
    if (localRoutes && localRoutes.length > 0) {
      var pathname = urlparse(req.url).pathname;
      for (var i = 0, l = localRoutes.length; i < l; i++) {
        var route = localRoutes[i];
        var urlroute = route[0];
        var fn = route[1];
        var match = urlroute.match(pathname);
        if (match) {
          req[options.paramsName] = match;
          return fn(req, res, next);
        }
      }
    }
    // not found
    next ? next() : notFound(req, res);
  };
}

module.exports = router;