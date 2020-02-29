nconf = require 'nconf'

config = {}

configFile = 'config.json'

if process.env['config_file']?
  configFile = process.env['config_file']

nconf.file(configFile).env()

config.entryRoute = nconf.get('server_entryRoute') || '/entry'

config.port = nconf.get('server_localPort') || 8081
if process.env.PORT?
  config.port = process.env.PORT

config.mongoUri = nconf.get('mongoDb_uri') || "mongodb://localhost/appCatalog"
config.user = nconf.get('server_auth_user') || "catUser"
config.password = nconf.get('server_auth_password') || "CatsAreUs"

module.exports = config