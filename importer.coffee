module.exports = (source) ->
  for prop of source
    global[prop] = source[prop]