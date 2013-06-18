/*!
 * urlrouter - test/utils.test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = process.env.URLROUTER_COV ? require('../lib-cov/utils') : require('../lib/utils');
var should = require('should');

describe('utils.test.js', function () {

  describe('createRouter()', function () {

    it('should match regexp', function () {
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
    });

    it('should match all string', function () {

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
          ["/products.json", "/products.xml", "/products"],
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

    });

  });
});