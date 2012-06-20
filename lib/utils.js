/*!
 * urlrouter - lib/utils.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

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

exports.createRouter = function (router) {
  return new Router(router);
};