requireCover = require('./requireCover')('app')
AppCatalogEntry = requireCover 'appCatalogEntry'
should = require 'should'

test = (description, createEntryFunc, assertFunc, assertData) ->
  it description, (done) ->
    entry = createEntryFunc()
    _validate entry, (errs) ->
      assertFunc errs, assertData
      done()

ex = (exceedCount) ->
  exceedCount+=2
  return Array(exceedCount).join('-')

_validate = (data, callback) ->
  AppCatalogEntry.validate data, callback

_getError = (errs, instanceContext, constraintName, memberName) ->
  for err in errs
    if err.instanceContext is instanceContext and 
      err.constraintName is constraintName and 
      memberName in err.constraintValue
        return err
  return null

_getErrorExact = (errs, instanceContext, constraintName, constraintValue) ->
  if not errs?
    return null
  for err in errs
    if err.instanceContext is instanceContext and 
      err.constraintName is constraintName and 
      err.constraintValue is constraintValue
        return err
  return null

_expectExactErrors = (errs, propertyPaths, constraintName) ->
  missingErrors = []
  errorCollectFunc = errorCollectFunc | (errors) ->
  for propertyPath, expectedValue of propertyPaths
    error = _getErrorExact(errs, propertyPath, constraintName, expectedValue)
    if not error?
      missingErrors.push("Missing #{constraintName} constraint violation error for #{propertyPath}")
  if missingErrors.length > 0

    throw new Error("Expected to find #{Object.keys(propertyPaths).length} #{constraintName} constraint violation errors, but missing #{missingErrors.length} of them! Here they are:\n#{missingErrors.join('\n')}")  

expectMaxLengthsExceeded = (errs, propertyPaths) ->
  _expectExactErrors errs, propertyPaths, 'maxLength'

expectTypesInvalid = (errs, propertyPaths) ->
  _expectExactErrors errs, propertyPaths, 'type'

expectMinPropertiesNotMet = (errs, propertyPaths) ->
  _expectExactErrors errs, propertyPaths, 'minProperties'

expectPropertiesMissing = (errs, propertyPaths) ->
  missingErrors = []
  for propertyPath, propertyNames of propertyPaths
    for propertyName in propertyNames     
      error = _getError(errs, propertyPath, 'required', propertyName)
      if not error?
        missingErrors.push("Missing required constraint violation error for #{propertyPath}/#{propertyName}")
  if missingErrors.length > 0
    throw new Error("Expected to find #{propertyNames.length} required constraint violation errors, but missing #{missingErrors.length} of them! Here they are:\n#{missingErrors.join('\n')}")

expectNoErrors = (errs) ->
  should.not.exist errs

expectErrorsEqual = (errs, data) ->
  for index, value of data    
    errs[Number(index)].should.eql value

module.exports =
  test: test
  ex: ex
  expectPropertiesMissing: expectPropertiesMissing
  expectTypesInvalid: expectTypesInvalid
  expectMaxLengthsExceeded: expectMaxLengthsExceeded
  expectMinPropertiesNotMet: expectMinPropertiesNotMet
  expectNoErrors: expectNoErrors
  expectErrorsEqual: expectErrorsEqual