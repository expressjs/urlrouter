TESTS = test/*.js
TIMEOUT = 1000
REPORTER = spec
SUPPORT_VERSIONS := 1.9.2 1.9.1 1.9.0 1.8.0 1.8.5 1.8.6 1.8.7 \
	2.2.0 2.2.1 2.2.2 \
	2.3.0 2.3.1 2.3.2 2.3.3 2.3.4 2.3.5 2.3.6 2.3.7 2.3.8 2.3.9 \
	2.4.0 2.4.1 2.4.2 2.4.3 2.4.4 2.4.5 2.4.6 \
	2.5.0 \
	2.6.0 2.6.1 2.6.2 \
	2.7.0 2.7.1
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

lib-cov:
	@rm -rf $@
	@$(JSCOVERAGE) lib $@

test-cov: lib-cov
	@URLROUTER_COV=1 $(MAKE) test REPORTER=dot
	@URLROUTER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test-version:
	@for version in $(SUPPORT_VERSIONS); do \
		npm install connect@$$version --loglevel=warn; \
		$(MAKE) test REPORTER=min; \
	done

.PHONY: test test-cov lib-cov test-version test-results