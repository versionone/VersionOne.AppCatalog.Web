nconf = require 'nconf'

config = {}

nconf.file('config.json').env()

config.entryRoute = nconf.get('server_entryRoute') || '/entry'

console.log config.entryRoute

config.port = nconf.get('server_localPort') || 8081
if process.env.PORT?
  config.port = process.env.PORT

config.mongoUri = nconf.get 'mongoDb_uri'
config.user = nconf.get 'server_auth_user'
config.password = nconf.get 'server_auth_password'

module.exports = config