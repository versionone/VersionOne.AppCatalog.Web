#!/usr/bin/sh
mkdir -p testResults
mocha -R tap *.tests*js >testResults/testResults.tap
cat testResults/testResults.tap