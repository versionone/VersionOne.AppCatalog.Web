config = {}

config.entryRoute = '/entry'
config.localPort = 8088

#LOCAL or STAGING, depending on if the port env variable is present.  it will be on the node azure host.
if not process.env.PORT?
	config.mongoUrl = 'mongodb://localhost/test'
else  
  config.mongoUrl = 'mongodb://localhost/test'

module.exports = config