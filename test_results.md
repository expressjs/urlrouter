# TOC
   - [http.createServer()](#httpcreateserver)
     - [support RegExp()](#httpcreateserver-support-regexp)
     - [get()](#httpcreateserver-get)
     - [post()](#httpcreateserver-post)
     - [put()](#httpcreateserver-put)
     - [head()](#httpcreateserver-head)
     - [delete()](#httpcreateserver-delete)
     - [404 Page Not Found](#httpcreateserver-404-page-not-found)
   - [connect.createServer()](#connectcreateserver)
     - [support RegExp()](#connectcreateserver-support-regexp)
     - [get()](#connectcreateserver-get)
     - [post()](#connectcreateserver-post)
     - [put()](#connectcreateserver-put)
     - [head()](#connectcreateserver-head)
     - [delete()](#connectcreateserver-delete)
     - [404 Page Not Found](#connectcreateserver-404-page-not-found)
   - [options.pageNotFound() and options.errorHandler()](#optionspagenotfound-and-optionserrorhandler)
   - [use connect with options.errorHandler()](#use-connect-with-optionserrorhandler)
   - [utils.js](#utilsjs)
     - [createRouter()](#utilsjs-createrouter)
<a name="" />
 
<a name="httpcreateserver" />
# http.createServer()
<a name="httpcreateserver-support-regexp" />
## support RegExp()
should /user 200.

```js
app.request().get('/user').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /users 200.

```js
app.request().get('/users').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /users/123 200.

```js
app.request().get('/users/123').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['123', null]);
  done();
});
```

should /users/mk2 200 return [null, null].

```js
app.request().get('/users/mk2').end(function (res) {
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /user/123 200.

```js
app.request().get('/user/123').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['123', null]);
  done();
});
```

should /users/1..100 200.

```js
app.request().get('/users/1..100').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['1', '100']);
  done();
});
```

should /topic/9999 200.

```js
app.request().get('/topic/9999').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('topic 9999');
  done();
});
```

<a name="httpcreateserver-get" />
## get()
should return / home page.

```js
app.request().get('/').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('home page');
  done();
});
```

should return /foo.

```js
app.request().get('/foo').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /foo');
  done();
});
```

should return /mw.

```js
app.request().get('/mw').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /mw');
  done();
});
```

should return /mwMulti.

```js
app.request().get('/mwMulti').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /mwMulti');
  done();
});
```

should return /mwError with error.

```js
app.request().get('/mwError').end(function (res) {
  res.should.status(500);
  res.body.toString().should.include('Some Error');
  done();
});
```

should return /mwReturn.

```js
app.request().get('/mwReturn').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('return by middleware');
  done();
});
```

<a name="httpcreateserver-post" />
## post()
should /post 200.

```js
app.request().post('/post').write(' helloworld').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('POST /post helloworld');
  done();
});
```

<a name="httpcreateserver-put" />
## put()
should /put 200.

```js
app.request().put('/put').write(' helloworld').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('PUT /put helloworld');
  done();
});
```

<a name="httpcreateserver-head" />
## head()
should /status 200.

```js
app.request().head('/status').end(function (res) {
  res.should.status(200);
  done();
});
```

<a name="httpcreateserver-delete" />
## delete()
should /remove 200.

```js
app.request().delete('/remove').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('DELETE /remove');
  done();
});
```

<a name="httpcreateserver-404-page-not-found" />
## 404 Page Not Found
should get /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should post /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should put /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should delete /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should head /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should options /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

<a name="connectcreateserver" />
# connect.createServer()
<a name="connectcreateserver-support-regexp" />
## support RegExp()
should /user 200.

```js
app.request().get('/user').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /users 200.

```js
app.request().get('/users').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /users/123 200.

```js
app.request().get('/users/123').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['123', null]);
  done();
});
```

should /users/mk2 200 return [null, null].

```js
app.request().get('/users/mk2').end(function (res) {
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql([null, null]);
  done();
});
```

should /user/123 200.

```js
app.request().get('/user/123').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['123', null]);
  done();
});
```

should /users/1..100 200.

```js
app.request().get('/users/1..100').end(function (res) {
  res.should.status(200);
  var params = JSON.parse(res.body);
  params.should.length(2);
  params.should.eql(['1', '100']);
  done();
});
```

should /topic/9999 200.

```js
app.request().get('/topic/9999').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('topic 9999');
  done();
});
```

<a name="connectcreateserver-get" />
## get()
should return / home page.

```js
app.request().get('/').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('home page');
  done();
});
```

should return /foo.

```js
app.request().get('/foo').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /foo');
  done();
});
```

should return /mw.

```js
app.request().get('/mw').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /mw');
  done();
});
```

should return /mwMulti.

```js
app.request().get('/mwMulti').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('GET /mwMulti');
  done();
});
```

should return /mwError with error.

```js
app.request().get('/mwError').end(function (res) {
  res.should.status(500);
  res.body.toString().should.include('Some Error');
  done();
});
```

should return /mwReturn.

```js
app.request().get('/mwReturn').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('return by middleware');
  done();
});
```

<a name="connectcreateserver-post" />
## post()
should /post 200.

```js
app.request().post('/post').write(' helloworld').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('POST /post helloworld');
  done();
});
```

<a name="connectcreateserver-put" />
## put()
should /put 200.

```js
app.request().put('/put').write(' helloworld').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('PUT /put helloworld');
  done();
});
```

<a name="connectcreateserver-head" />
## head()
should /status 200.

```js
app.request().head('/status').end(function (res) {
  res.should.status(200);
  done();
});
```

<a name="connectcreateserver-delete" />
## delete()
should /remove 200.

```js
app.request().delete('/remove').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('DELETE /remove');
  done();
});
```

<a name="connectcreateserver-404-page-not-found" />
## 404 Page Not Found
should get /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should post /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should put /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should delete /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should head /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

should options /404 not found.

```js
app.request()[method]('/404').end(function (res) {
  res.should.status(404);
  if (method !== 'head') {
    res.body.toString().should.equal(method.toUpperCase() + ' /404 Not Found ');
  }
  done();
});
```

<a name="optionspagenotfound-and-optionserrorhandler" />
# options.pageNotFound() and options.errorHandler()
should using custom page not found handler.

```js
app.request().get('/404').end(function (res) {
  res.should.status(404);
  res.body.toString().should.equal('oh no, page /404 missing...');
  done();
});
```

should using custom error handler.

```js
app.request().get('/error').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('oh no, error occurred on /error');
  done();
});
```

<a name="use-connect-with-optionserrorhandler" />
# use connect with options.errorHandler()
should using custom error handler.

```js
app.request().get('/error').end(function (res) {
  res.should.status(200);
  res.body.toString().should.equal('oh no, error occurred on /error');
  done();
});
```

<a name="utilsjs" />
# utils.js
<a name="utilsjs-createrouter" />
## createRouter()
should match regexp.

```js
var router = utils.createRouter(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/);
var cases = [
  ['/user', [undefined, undefined]],
  ['/users', [undefined, undefined]],
  ['/users/1..100', ['1', '100']],
  ['/user/123', ['123', undefined]]
];
cases.forEach(function (item) {
  var url = item[0];
  var m = router.match(url);
  should.ok(m);
  m.should.eql(item[1]);
});
```

should match all string.

```js
// http://expressjs.com/guide.html#routing
      var cases = [
        // [urlrouter, [matchs], [dont matchs]]
        ["/user/:id", 
          [
            ["/user/12", {id: '12'}], 
            ["/user/mk2", {id: 'mk2'}],
            ["/user/mk2.123@$qwe,.xml-_hdhd", {id: 'mk2.123@$qwe,.xml-_hdhd'}],
            ["/user/中文", {id: '中文'}],
            ['/user/%E4%B8%AD%E5%8D%88', {id: '%E4%B8%AD%E5%8D%88'}]
          ], 
          ["/user", "/", "/use/12", "/user12"]
        ],
        ["/users/:name?", 
          [
            ["/users/5", {name: '5'}], ["/users", {}], ["/users/", {}]
          ], ["/user", "/", "/user/12", "/users12"]],
        ["/index/:i([0-9])",
          [
            ['/index/1', {i: '1'}, '/index/0', {i: '0'}]
          ],
          ['/index/', '/index', '/index/a', '/index/123', '/index/12', '/index/:i']
        ],
        ["/user/:name/status/:id([0-9]+)", 
          [
            ["/user/123/status/456", {name: '123', id: '456'}], 
            ["/user/mk2/status/783972", {name: 'mk2', id: '783972'}],
            ["/user/mk-2005_bac/status/783972", {name: 'mk-2005_bac', id: '783972'}]
          ], ["/user/foo", "/user", "/user/", "/user/mk2/status/foo"]],
        ["/files/*", ["/files/jquery.js", "/files/javascripts/jquery.js"], ['/files/', '/files']],
        ["/files/*.*", ["/files/jquery.js", "/files/javascripts/jquery.js"], ['/files/', '/files']],
        ["/user/:id/:operation?", 
          [["/user/1", {id: '1'}], ["/user/1/edit", {id: '1', operation: 'edit'}]]
        ],
        ["/products.:format", 
          [["/products.json", {format: 'json'}], ["/products.xml", {format: 'xml'}]], 
          [
            "/products", "/products/"
            // "/products."
          ]
        ],
        ["/products.:format(json|xml)", 
          [["/products.json", {format: 'json'}], ["/products.xml", {format: 'xml'}]], 
          [
            "/products", "/products/",
            "/products.txt", "/products.html", "/products.js", "/products.xml2", "/products.rss"
          ]
        ],
        ["/products.:format?", 
          ["/products.json", "/products.xml", "/products"]
        ],
        ["/user/:id.:format?", ["/user/12", "/user/12.json"]],
        ["/users", ["/users", "/users/"]],
        ["/users/", ["/users/"], ["/users", "/user"]]
      ];

      cases.forEach(function (item) {
        var router = utils.createRouter(item[0]);
        var matchs = item[1];
        var unmatchs = item[2] || [];
        matchs.forEach(function (match) {
          var url;
          var params = null;
          if (Array.isArray(match)) {
            url = match[0];
            params = match[1];
          } else {
            url = match;
          }
          var m = router.match(url);
          // console.log('match', m, url, router.rex, item[0]);
          should.ok(m);
          if (params) {
            m.should.eql(params);
          }
        });
        unmatchs.forEach(function (unmatch) {
          var m = router.match(unmatch);
          // console.log(unmatch, m, router.rex, item[0]);
          should.not.exist(m);
        });
      });
```

