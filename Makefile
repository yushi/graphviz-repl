MOCHA=./node_modules/
test:
	`npm bin`/mocha

cov: lib-cov
	`npm bin`/mocha --reporter html-cov > coverage.html

lib-cov:
	`which node`/../../lib/node_modules/visionmedia-jscoverage/jscoverage lib lib-cov

clean:
	rm -rf ./coverage.html
	rm -rf ./lib-cov

.PHONY: test cov lib-cov clean

