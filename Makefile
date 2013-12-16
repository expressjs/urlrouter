TESTS = test/*.test.js
TIMEOUT = 1000
REPORTER = spec
MOCHA_OPTS =
SUPPORT_VERSIONS := 1.9.2 1.9.1 1.9.0 1.8.0 1.8.5 1.8.6 1.8.7 \
	2.2.0 2.2.1 2.2.2 \
	2.3.0 2.3.1 2.3.2 2.3.3 2.3.4 2.3.5 2.3.6 2.3.7 2.3.8 2.3.9 \
	2.4.0 2.4.1 2.4.2 2.4.3 2.4.4 2.4.5 2.4.6 \
	2.5.0 \
	2.6.0 2.6.1 2.6.2 \
	2.7.0 2.7.1 2.7.2 2.7.3 2.7.4 2.7.5 2.7.6 2.7.7 2.7.8 2.7.9 2.7.10 2.7.11 \
	2.8.0 2.8.1 2.8.2 2.8.3 2.8.4

install:
	@npm install --registry=http://registry.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--bail \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov

test-cov-html:
	@rm -f coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
	@ls -lh coverage.html

test-coveralls: test
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@-$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-version:
	@for version in $(SUPPORT_VERSIONS); do \
		npm install connect@$$version --loglevel=warn; \
		$(MAKE) test REPORTER=min; \
	done

test-all: test test-cov

.PHONY: test
