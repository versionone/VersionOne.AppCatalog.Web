config = {}

config.entryRoute = '/entry'
config.localPort = 8081

#LOCAL or STAGING, depending on if the port env variable is present.  it will be on the node azure host.
if not process.env.PORT?
	#config.mongoUrl = 'mongodb://localhost/test'
  	# to connect to production instance:
  	config.mongoUrl = 'mongodb://appcatalog:appcatalog101#@ds061237.mongolab.com:61237/appcatalogprod'
else
  # local:
  #config.mongoUrl = 'mongodb://localhost/test'
  # testing:
  #config.mongoUrl = 'mongodb://v1appCatalog-stage:SU1vOVTfMlua6IaJVkIaqJWOXVUrev3ZeoITHpujRxA-@ds045087.mongolab.com:45087/v1appCatalog-stage'
  # production:
  config.mongoUrl = 'mongodb://appcatalog:appcatalog101#@ds061237.mongolab.com:61237/appcatalogprod'

module.exports = config