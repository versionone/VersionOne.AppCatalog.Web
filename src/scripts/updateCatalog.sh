#!/bin/bash
if [[ -n $(git diff-tree --no-commit-id --name-only -r HEAD |grep product.json) ]]; then
	curl -X PUT http://appcatalogstage.azurewebsites.net/entry --user catUser:CatsAreUs -d @product.json -H "Content-type: application/json"
else
	echo No change to product.json detected, skipping App Catalog update
fi

