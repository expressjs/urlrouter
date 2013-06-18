/*!
 * urlrouter - example/http-hello.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');
var urlrouter = require('../');

var router = urlrouter(function (app) {
  app.get('/', function (req, res) {
    res.end('GET home page' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.get('/user/:id', function (req, res) {
    res.end('user: ' + req.params.id);
  });

  app.get(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, function (req, res) {
    res.end(req.url + ' : ' + req.params);
  });

  app.get('/foo', function (req, res) {
    res.end('GET ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.post('/new', function (req, res) {
    res.write('POST ' + req.url + ' start...\n\n');
    var counter = 0;
    req.on('data', function (data) {
      counter++;
      res.write('data' + counter + ': ' + data.toString() + '\n\n');
    });
    req.on('end', function () {
      res.end('POST ' + req.url + ' end.\n');
    });
  });

  app.patch('/users/foo', function (req, res) {
    res.write('PATCH update ' + req.url + ' start...\n\n');
    var counter = 0;
    req.on('data', function (data) {
      counter++;
      res.write('data' + counter + ': ' + data.toString() + '\n\n');
    });
    req.on('end', function () {
      res.end('PATCH update ' + req.url + ' end.\n');
    });
  });

  app.put('/update', function (req, res) {
    res.end('PUT ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.delete('/remove', function (req, res) {
    res.end('DELETE ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.options('/check', function (req, res) {
    res.end('OPTIONS ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.all('/all', function (req, res) {
    res.end('ALL methods request /all should be handled' + ' , headers: ' + JSON.stringify(req.headers));
  });
});

http.createServer(router).listen(3000);
