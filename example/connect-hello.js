/*!
 * urlrouter - example/connect-hello.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

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