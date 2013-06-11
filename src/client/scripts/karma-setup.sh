#!/bin/bash

npm install karma@canary
npm install karma-coverage
npm install karma-phantomJS-launcher
npm install karma-junit-reporter
npm install PhantomJS

cd ~/AppData/Roaming/npm/node_modules
git clone https://github.com/karma-runner/karma-ng-html2js-preprocessor.git
