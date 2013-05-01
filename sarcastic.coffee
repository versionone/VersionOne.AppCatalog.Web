sinon = require 'sinon'
mockery = require 'mockery'
mockery.enable
	warnOnReplace: false
	warnOnUnregistered: false

# private state
_mock = {}
_target = null

# private functions
_createSarcasm = () ->
	_mock = sinon.mock _target
	return _mock

_clearSarcasm = ->
	_mock.restore()

_verifySarcasm = ->
	_mock.verify()

#public interface

configTarget = (dependencyName, target) ->
	# Tell mockery to replace calls to require(<dependencyName>) with our 
	# target type declared above
	mockery.registerMock dependencyName, target
	_target = target

getMock = () ->
	return _mock

must = (name, configCallback) ->
	it name, (done) ->
		_createSarcasm()
		configCallback()
		_verifySarcasm()
		_clearSarcasm()
		done()
		
module.exports = { must: must, configTarget: configTarget,  getMock: getMock }