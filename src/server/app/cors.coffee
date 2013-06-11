cors = (req, res, next) ->
  oneof = false
  if req.headers.origin
    res.header "Access-Control-Allow-Origin", req.headers.origin
    oneof = true
  if req.headers["access-control-request-method"]
    res.header "Access-Control-Allow-Methods", req.headers["access-control-request-method"]
    oneof = true
  if req.headers["access-control-request-headers"]
    res.header "Access-Control-Allow-Headers", req.headers["access-control-request-headers"]
    oneof = true
  res.header "Access-Control-Max-Age", 60 * 60 * 24 * 365 if oneof
  
  # intercept OPTIONS method
  if oneof and req.method is "OPTIONS"
    res.send 200
  else
    next()

module.exports.cors = cors