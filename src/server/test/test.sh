#!/usr/bin/sh
mkdir testResults
mocha -R tap *.tests*js >testResults/testResults.tap