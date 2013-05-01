args = process.argv.splice(2)

settingsModule = args[0] || './settings'

settings = require settingsModule
server = require './serverClass'

# Run it.
app = server(settings)