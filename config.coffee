nconf = require 'nconf'

config = {}

nconf.file('config.json').env()

config.entryRoute = nconf.get('server.entryRoute') || '/entry'

console.log config.entryRoute

config.port = nconf.get 'server.localPort'
if process.env.PORT?
  config.port = process.env.PORT

config.mongoUri = nconf.get 'mongoDb.uri'
config.user = nconf.get 'server.auth.user'
config.password = nconf.get 'server.auth.password'

module.exports = config