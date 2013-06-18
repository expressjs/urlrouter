/*!
 * urlrouter - urlouter.test.js
 * Copyright(c) 2012 - 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var pedding = require('pedding');
var fs = require('fs');
var http = require('http');
var connect = require('connect');
var urlrouter = require('../');

var middleware = function (req, res, next) {
  var action = req.url || '';
  if (action === '/mwError') {
    return next(new Error('Some Error'));
  } else if (action === '/mwReturn') {
    return res.end('return by middleware');
  } else {
    return next();
  }
};

var router = urlrouter(function (app) {
  app.get('/', function (req, res) {
    res.end('home page');
  });
  app.get(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, function (req, res) {
    res.end(JSON.stringify(req.params));
  });
  app.get('/topic/:id', function (req, res) {
    res.end('topic ' + req.params.id);
  });
  app.get('/foo', function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.get('/all', function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.all('/all', function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.get('/mw', middleware, function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.get('/mwMulti', [middleware, [middleware]], function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.get('/mwError', middleware, function (err, req, res) {
    res.end('error occurred');
  });
  app.get('/mwReturn', middleware, function (req, res) {
    res.end(req.method + ' ' + req.url);
  });
  app.get('/searchlist', function (req, res) {
    res.end(JSON.stringify({
      url: req.url,
      params: req.params
    }));
  });
  app.get('/search.:format?', function (req, res) {
    res.end(JSON.stringify({
      url: req.url,
      params: req.params
    }));
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
        app.use(urlrouter.pageNotFound);
      }
      app = app.listen(0, done);
    });
    after(function () {
      app.close();
    });

    describe('support RegExp()', function () {
      it('should /user 200', function (done) {
        app.request().get('/user').end(function (res) {
          res.should.status(200);
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql([null, null]);
          done();
        });
      });

      it('should /users 200', function (done) {
        app.request().get('/users').end(function (res) {
          res.should.status(200);
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql([null, null]);
          done();
        });
      });

      it('should /users/123 200', function (done) {
        app.request().get('/users/123').end(function (res) {
          res.should.status(200);
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql(['123', null]);
          done();
        });
      });

      it('should /users/mk2 200 return [null, null]', function (done) {
        app.request().get('/users/mk2').end(function (res) {
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql([null, null]);
          done();
        });
      });

      it('should /user/123 200', function (done) {
        app.request().get('/user/123').end(function (res) {
          res.should.status(200);
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql(['123', null]);
          done();
        });
      });

      it('should /users/1..100 200', function (done) {
        app.request().get('/users/1..100').end(function (res) {
          res.should.status(200);
          var params = JSON.parse(res.body);
          params.should.length(2);
          params.should.eql(['1', '100']);
          done();
        });
      });

      it('should /topic/9999 200', function (done) {
        app.request().get('/topic/9999').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('topic 9999');
          done();
        });
      });
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

      it('should return /mw', function (done) {
        app.request().get('/mw').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('GET /mw');
          done();
        });
      });

      it('should return /mwMulti', function (done) {
        app.request().get('/mwMulti').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('GET /mwMulti');
          done();
        });
      });

      it('should return /mwError with error', function (done) {
        app.request().get('/mwError').end(function (res) {
          res.should.status(500);
          res.body.toString().should.include('Some Error');
          done();
        });
      });

      it('should return /mwReturn', function (done) {
        app.request().get('/mwReturn').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('return by middleware');
          done();
        });
      });

      it('should /search.:format?', function (done) {
        done = pedding(2, done);
        app.request().get('/search').end(function (res) {
          res.should.status(200);
          var result = JSON.parse(res.body);
          result.should.have.keys('url', 'params');
          result.should.have.property('url', '/search');
          result.params.should.eql({});
          done();
        });
        app.request().get('/search.json').end(function (res) {
          res.should.status(200);
          var result = JSON.parse(res.body);
          result.should.have.keys('url', 'params');
          result.should.have.property('url', '/search.json');
          result.params.should.eql({format: 'json'});
          done();
        });
      });

      it('should /searchlist', function (done) {
        app.request().get('/searchlist').end(function (res) {
          res.should.status(200);
          var result = JSON.parse(res.body);
          result.should.have.keys('url', 'params');
          result.should.have.property('url', '/searchlist');
          result.params.should.eql({});
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

    describe('all()', function () {
      it('should get /all 200', function (done) {
        app.request().get('/all').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('GET /all');
          done();
        });
      });
      it('should post /all 200', function (done) {
        app.request().post('/all').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('POST /all');
          done();
        });
      });
      it('should put /all 200', function (done) {
        app.request().put('/all').end(function (res) {
          res.should.status(200);
          res.body.toString().should.equal('PUT /all');
          done();
        });
      });
    });

    describe('404 Page Not Found', function () {
      var METHODS = urlrouter.METHODS;
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

var routerWithCustomHandler = urlrouter(function (app) {
  app.get('/error', function (req, res, next) {
    return next(new Error('Some more Error'));
  }, function (req, res) {
    res.end('should not come here');
  });
}, {
  pageNotFound: function (req, res) {
    res.statusCode = 404;
    res.end('oh no, page ' + req.url + ' missing...');
  },
  errorHandler: function (err, req, res) {
    res.statusCode = 200;
    res.end('oh no, error occurred on ' + req.url);
  }
});

describe('options.pageNotFound() and options.errorHandler()', function () {
  var app;
  before(function (done) {
    app = http.createServer(routerWithCustomHandler);
    app.listen(0, done);
  });
  after(function () {
    app.close();
  });
  it('should using custom page not found handler', function (done) {
    app.request().get('/404').end(function (res) {
      res.should.status(404);
      res.body.toString().should.equal('oh no, page /404 missing...');
      done();
    });
  });
  it('should using custom error handler', function (done) {
    app.request().get('/error').end(function (res) {
      res.should.status(200);
      res.body.toString().should.equal('oh no, error occurred on /error');
      done();
    });
  });
});

describe('use connect with options.errorHandler()', function () {
  var app;
  before(function (done) {
    app = connect.createServer(routerWithCustomHandler);
    app = app.listen(0, done);
  });
  after(function () {
    app.close();
  });
  it('should using next first', function (done) {
    app.request().get('/error').end(function (res) {
      res.should.status(500);
      res.body.toString().should.include('Some more Error');
      done();
    });
  });
});