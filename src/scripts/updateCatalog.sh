#!/bin/bash
if [[ -n $(git diff-tree --no-commit-id --name-only -r HEAD |grep product.json) ]]; then
	curl --request PUT http://appcatalogstage.azurewebsites.net/entry \
		--user catUser:CatsAreUs \
		--data @product.json \
		--header "Content-type: application/json" \
		--fail
else
	echo No change to product.json detected, skipping App Catalog update
fi

