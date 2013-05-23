#!/usr/bin/sh
export app_cov=1
../../lib/jscoverage --no-highlight ../app ../app_cov
mocha -R html-cov *.tests*js >coverage.html
