# urlrouter

[![Build Status](https://secure.travis-ci.org/fengmk2/urlrouter.png)](http://travis-ci.org/fengmk2/urlrouter)

`http` url router.

[connect](https://github.com/senchalabs/connect) missing router middleware.

Support [express](http://expressjs.com) format [routing](http://expressjs.com/guide.html#routing).

Support `connect` @1.8.x and @2.2.0+ .

## Test connect version

* 1.8.0+: 1.8.0 1.8.5 1.8.6 1.8.7 **1.9.0**
* 2.2.0+: 2.2.0 2.2.1 2.2.2 2.3.0 2.3.1 2.3.2 **2.3.3**

```bash
$ make test-version
```

test results: [test_results.md](https://github.com/fengmk2/urlrouter/blob/master/test_results.md)

jscoverage: [**100%**](http://fengmk2.github.com/coverage/urlrouter.html)

## Install

```bash
$ npm install urlrouter
```

## Usage

### Using with `connect`

```javascript
var connect = require('connect');
var urlrouter = require('urlrouter');

connect(urlrouter(function (app) {
  app.get('/', function (req, res, next) {
    res.end('hello urlrouter');
  });
  app.get('/user/:id([0-9]+)', function (req, res, next) {
    res.end('hello user ' + req.params.id);
  });
})).listen(3000);
```

Several callbacks may also be passed.

```javascript

function loadUser(req, res, next) {
  // You would fetch user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

app.get('/user/:id', loadUser, function () {
  // ...
});
```

These callbacks can be passed within arrays as well.

```javascript
var middleware = [loadUser, [loadForum, loadThread]];
app.post('/forum/:fid/thread/:tid', middleware, function () {
 // ...
});
```

### Using with `http.createServer()`

```javascript
var http = require('http');
var urlrouter = require('urlrouter');

var options = {
  pageNotFound: function (req, res) {
    res.statusCode = 404;
    res.end('er... some page miss...');
  },
  errorHandler: function (req, res) {
    res.statusCode = 500;
    res.end('oops..error occurred');
  }
};

function loadUser(req, res, next) {
  // You would fetch user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

var router = urlrouter(function (app) {
  app.get('/', function (req, res) {
    res.end('GET home page' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });
  // with route middleware
  app.get('/user/:id', loadUser,  function (req, res) {
    res.end('user: ' + req.params.id);
  });

  app.get(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, loadUser, function (req, res) {
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

  app.put('/update', function (req, res) {
    res.end('PUT ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.delete('/remove', function (req, res) {
    res.end('DELETE ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });

  app.options('/check', function (req, res) {
    res.end('OPTIONS ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
  });
}, options);

http.createServer(router).listen(3000);
```

## Contributors
Ordered by date of first contribution.
[Auto-generated](http://github.com/dtrejo/node-authors) on Thu Sep 13 2012 10:49:38 GMT+0800 (CST).

- [fengmk2](https://github.com/fengmk2)
- [rockdai](https://github.com/rockdai)

## License 

(The MIT License)

Copyright (c) 2012 fengmk2 <fengmk2@gmail.com>.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
