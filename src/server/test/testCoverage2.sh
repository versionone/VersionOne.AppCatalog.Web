#!/usr/bin/sh
rm -rf ../app_cov
export app_cov=1
../../lib/jscoverage --no-highlight ../app ../app_cov
mkdir testResults
mocha -R mocha-cobertura-reporter *.tests*js >testResults/coverage.xml