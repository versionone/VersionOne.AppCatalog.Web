#!/usr/bin/sh
export PATH=$(pwd)/../../node_modules/.bin:$PATH
cd test
./test.sh
cd ..