#!/bin/bash

# ----------------------
# KUDU Deployment Script
# ----------------------

# Helpers
# -------

exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "An error has occured during web site deployment."
    echo $1
    exit 1
  fi
}

# Prerequisites
# -------------

# Verify node.js installed
hash node 2>/dev/null
exitWithMessageOnError "Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment."

# Setup
# -----

SCRIPT_DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ARTIFACTS=$SCRIPT_DIR/artifacts

if [[ ! -n "$DEPLOYMENT_SOURCE" ]]; then
  DEPLOYMENT_SOURCE=$SCRIPT_DIR
fi

if [[ ! -n "$NEXT_MANIFEST_PATH" ]]; then
  NEXT_MANIFEST_PATH=$ARTIFACTS/manifest

  if [[ ! -n "$PREVIOUS_MANIFEST_PATH" ]]; then
    PREVIOUS_MANIFEST_PATH=$NEXT_MANIFEST_PATH
  fi
fi

if [[ ! -n "$KUDU_SYNC_CMD" ]]; then
  # Install kudu sync
  echo Installing Kudu Sync
  npm install kudusync -g --silent
  exitWithMessageOnError "npm failed"

  KUDU_SYNC_COMMAND="kuduSync"
fi

# gb: add logic to install mocha
if [[ ! -n "$MOCHA_COMMAND" ]]; then
  # Install mocha
  echo Installing mocha
  npm install mocha -g --silent
  exitWithMessageOnError "npm failed"
 
  MOCHA_COMMAND="$APPDATA\\npm\\node_modules\\mocha\\bin\\mocha"
fi

# gb: npm install moved to happen BEFORE the deployment step instead of after
# 2. Install npm packages
npm install --production --silent
exitWithMessageOnError "npm failed"
cd - > /dev/null
 
if [[ ! -n "$DEPLOYMENT_TARGET" ]]; then
  DEPLOYMENT_TARGET=$ARTIFACTS/wwwroot
  # gb: If running locally just set to call mocha directly
  MOCHA_COMMAND="./runTests.sh"
else
  # In case we are running on kudu service this is the correct location of kuduSync
  KUDU_SYNC_COMMAND="$APPDATA\\npm\\node_modules\\kuduSync\\bin\\kuduSync"
fi

##################################################################################################################################
# Deployment
# ----------
echo Handling node.js deployment.
 
# 1. gb: Run the tests!
echo Running unit tests
./runTestsOnAzure.sh
# $MOCHA_COMMAND 
exitWithMessageOnError "Unit tests failed"
 
# 2. KuduSync
echo Kudu Sync from "$DEPLOYMENT_SOURCE" to "$DEPLOYMENT_TARGET"
$KUDU_SYNC_COMMAND -q -f "$DEPLOYMENT_SOURCE" -t "$DEPLOYMENT_TARGET" -n "$NEXT_MANIFEST_PATH" -p "$PREVIOUS_MANIFEST_PATH" -i ".git;.deployment;deploy.sh" 2> /dev/null
exitWithMessageOnError "Kudu Sync failed"
 
 
##################################################################################################################################
 
echo "Finished successfully."