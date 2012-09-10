/*!
 * urlrouter - lib/utils.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

/**
 * URL Router
 * @param {String} url, routing url.
 *  e.g.: /user/:id, /user/:id([0-9]+), /user/:id.:format?
 */
function Router(url) {
  this.keys = null;
  if (url instanceof RegExp) {
    this.rex = url;
    this.source = this.rex.source;
    return;
  }

  var keys = [];
  this.source = url;
  url = url.replace(/\//g, '\\/') // '/' => '\/'
  .replace(/\./g, '\\.?') // '.' => '\.?'
  .replace(/\*/g, '.+'); // '*' => '.+'

  // ':id' => ([^\/]+), 
  // ':id?' => ([^\/]*), 
  // ':id([0-9]+)' => ([0-9]+)+, 
  // ':id([0-9]+)?' => ([0-9]+)* 
  url = url.replace(/:(\w+)(?:\(([^\)]+)\))?(\?)?/g, function (all, name, rex, atLeastOne) {
    keys.push(name);
    if (!rex) {
      rex = '[^\\/]' + (atLeastOne === '?' ? '*' : '+');
    }
    return '(' + rex + ')';
  });
  // /user/:id => /user, /user/123
  url = url.replace(/\\\/\(\[\^\\\/\]\*\)/g, '(?:\\/(\\w*))?');
  this.keys = keys;
  this.rex = new RegExp('^' + url + '\\/?$');
}

/**
 * Try to match given pathname, if match, return the match `params`.
 * 
 * @param {String} pathname
 * @return {Object|null} match `params` or null.
 */
Router.prototype.match = function (pathname) {
  var m = this.rex.exec(pathname);
  // console.log(this.rex, pathname, this.keys, m, this.source)
  var match = null;
  if (m) {
    if (!this.keys) {
      return m.slice(1);
    }
    match = {};
    var keys = this.keys;
    for (var i = 0, l = keys.length; i < l; i++) {
      var value = m[i + 1];
      if (value) {
        match[keys[i]] = value;
      }
    }
  }
  return match;
};

/**
 * Create a `Router` instance.
 *
 * @param {String|RegExp} urlpattern
 * @return {Router}
 */
exports.createRouter = function (urlpattern) {
  return new Router(urlpattern);
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret){
  var ret = ret || []
    , len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      exports.flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};