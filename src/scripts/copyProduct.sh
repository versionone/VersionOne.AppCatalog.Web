#!/bin/bash
echo Copying http://appcatalogstage.azurewebsites.net/entry?id=$1 to product.json
curl http://appcatalogstage.azurewebsites.net/entry/?id=$1 >product.json && \
curl -X PUT http://v1appcatalog.azurewebsites.net/entry --user $2 -d @product.json -H "Content-Type: application/json"