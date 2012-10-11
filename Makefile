MOCHA=./node_modules/
test:
	`npm bin`/mocha

cov: clean-cov lib-cov
	TEST_COV=1 `npm bin`/mocha --reporter html-cov > coverage.html

lib-cov:
	`which node`/../../lib/node_modules/visionmedia-jscoverage/jscoverage lib lib-cov

clean-cov:
	rm -rf ./lib-cov
	rm -rf ./coverage.html

clean: clean-cov

.PHONY: test cov lib-cov clean

