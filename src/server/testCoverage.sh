#!/usr/bin/sh
export PATH=$(pwd)/../../node_modules/.bin:$PATH
cd test
./testCoverage.sh
cd ..