/*!
 * urlrouter.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var urlparse = require('url').parse;
var utils = require('./utils');

var METHODS = ['get', 'post', 'put', 'delete', 'head', 'options'];

/**
 * Default page not found handler.
 * 
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
function pageNotFound(req, res) {
  res.statusCode = 404;
  res.end(req.method !== 'HEAD' && req.method + ' ' + req.url + ' Not Found ');
}

/**
 * Default error handler.
 * 
 * @param {Error} err
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
function errorHandler(err, req, res) {
  res.statusCode = 500;
  res.end(err.stack);
}

/**
 * Create a url router.
 * 
 * @param {Function(app)} fn
 * @param {Object} [options]
 *  - {String} paramsName, req[paramsName] for url router match `params`.
 *  - {Function(req, res)} pageNotFound, page not found handler.
 * @return {Function(req, res[, next])}
 * @public
 */
function router(fn, options) {
  var routes = [];
  var methods = {};
  options = options || {};
  options.paramsName = options.paramsName || 'params';
  options.pageNotFound = options.pageNotFound || pageNotFound;
  options.errorHandler = options.errorHandler || errorHandler;

  function createMethod(name) {
    var localRoutes = routes[name.toUpperCase()] = [];
    return function (urlpattern, handle) {
      var middleware = null;

      // slice middleware
      if (arguments.length > 2) {
        middleware = Array.prototype.slice.call(arguments, 1, arguments.length);
        handle = middleware.pop();
        middleware = utils.flatten(middleware);
      }

      localRoutes.push([utils.createRouter(urlpattern), handle, middleware]);
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
        var middleware = route[2];
        var match = urlroute.match(pathname);
        if (match) {
          req[options.paramsName] = match;
          // if middleware not exists or empty, return directly
          if (!middleware || !middleware.length) {
            return fn(req, res, next);
          }
          // route middleware
          var k = 0;
          var routeMiddleware = function (err) {
            var mw = middleware[k++];
            if (err) {
              var errHandler = next || options.errorHandler;
              return errHandler(err, req, res);
            } else if (mw) {
              return mw(req, res, routeMiddleware);
            } else {
              return fn(req, res, next);
            }
          }
          return routeMiddleware();
        }
      }
    }
    // not found
    next ? next() : options.pageNotFound(req, res);
  };
}

module.exports = router;