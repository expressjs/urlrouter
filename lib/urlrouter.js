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

  function createMethod(name) {
    var localRoutes = routes[name.toUpperCase()] = [];
    return function (urlpattern, handle) {
      localRoutes.push([utils.createRouter(urlpattern), handle]);
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
    next ? next() : options.pageNotFound(req, res);
  };
}

module.exports = router;