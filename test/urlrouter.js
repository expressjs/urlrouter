/*!
 * urlrouter.js test
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var rewire = require('rewire');
var fs = require('fs');
var http = require('http');
var connect = require('connect');
var urlrouter = process.env.URLROUTER_COV ? rewire('../lib-cov/urlrouter') : rewire('../lib/urlrouter');

var router = urlrouter(function (app) {
  app.get('/', function (req, res) {
    res.end('home page');
  });
  app.get('/foo', function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.head('/status', function (req, res) {
    res.end();
  });
  app.post('/post', function (req, res) {
    res.write(req.method + ' ' + req.url);
    req.on('data', function (data) {
      res.write(data);
    });
    req.on('end', function () {
      res.end();
    });
  });
  app.put('/put', function (req, res) {
    res.write(req.method + ' ' + req.url);
    req.on('data', function (data) {
      res.write(data);
    });
    req.on('end', function () {
      res.end();
    });
  });
  app.delete('/remove', function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
});

[http, connect].forEach(function (m, index) {

  var moduleName = index === 0 ? 'http' : 'connect';
  describe(moduleName + '.createServer()', function () {
    var app;
    before(function (done) {
      app = m.createServer(router);
      if (moduleName === 'connect') {
        app.use(urlrouter.__get__('notFound'));
      }
      app = app.listen(0, done);
    });
    after(function () {
      app.close();
    });

    describe('get()', function () {
      it('should return / home page', function (done) {
        app.request().get('/').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('home page');
          done();
        });
      });

      it('should return /foo', function (done) {
        app.request().get('/foo').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('GET /foo');
          done();
        });
      });
    });

    describe('post()', function () {
      it('should /post 200', function (done) {
        app.request().post('/post').write(' helloworld').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('POST /post helloworld');
          done();
        });
      });
    });

    describe('put()', function () {
      it('should /put 200', function (done) {
        app.request().put('/put').write(' helloworld').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('PUT /put helloworld');
          done();
        });
      });
    });

    describe('head()', function () {
      it('should /status 200', function (done) {
        app.request().head('/status').end(function (res) {
          res.should.status(200);
          done();
        });
      });
    });

    describe('delete()', function () {
      it('should /remove 200', function (done) {
        app.request().delete('/remove').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('DELETE /remove');
          done();
        });
      });
    });

    describe('404 Page Not Found', function () {
      var METHODS = urlrouter.__get__('METHODS');
      METHODS.forEach(function (method) {
        it('should ' + method + ' /404 not found', function (done) {
          app.request()[method]('/404').end(function (res) {
            res.should.status(404);
            if (method !== 'head') {
              res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
            }
            done();
          });
        });
      });
    });
  });

});

