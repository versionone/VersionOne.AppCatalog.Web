#!/bin/sh
if [[ -n $(git diff-tree --no-commit-id --name-only -r HEAD |grep changelog.coffee) ]]; then
	echo curl -X PUT http://appcatalog.azurewebsites.net/entry -d @changelog.json -H "Content-type: application/json"
else
	echo It did not change..
fi

