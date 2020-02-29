requireCover = require('./requireCover')('app')
should = require 'should'
sinon = require 'sinon'

must = (name, mock, configCallback) ->
	it name, (done) ->
		configCallback()
		mock.verify()
		mock.restore()
		done()

# Declare the external dependencies as a mock object, in this case just 
# stating the raw facts that it has three functional-level 'class functions'.
# We don't even care what the arguments are, really, because sinon will help 
# us verify the correct arguments later. Also mock out the constructor and the 
# save instance method to help verify behavior
class MockAppCatalogEntry
	this.currentInstance = {}
	constructor: (body) ->
		@id = body.id
		MockAppCatalogEntry.currentInstance = @
	save: sinon.spy()
	this.find = ->
	this.findOne = ->
	this.updateOne = ->
	this.validate = ->

# Note: the goofy thing here is that when you call sinon.mock,
# it modifies the target object in place, but returns you the 
# mock definition, which is where you actually set up your
# expectations. But, you still consume the original object.
# I guess.
mock = sinon.mock MockAppCatalogEntry

# Our actual subject under test is the service class
svc = requireCover 'service'

describe 'service', ->
	
	describe '#findAll', ->		
		subject = new svc(MockAppCatalogEntry)
		must 'call find', mock, ->
			mock.expects('find').once().withArgs {}, ''			
			subject.findAll()

	describe '#findById', ->
		subject = new svc(MockAppCatalogEntry)
		must 'call findOne', mock, ->
			id = 'v1clarityppm'
			mock.expects('findOne').once().withArgs { id: id }, ''			
			subject.findById id

	describe '#put', ->
		subject = new svc(MockAppCatalogEntry)
		must 'call validate and updateOne', mock, ->
			id = 'v1clarityppm'
			body = {id: id}
			mock.expects('validate')
				.once()
				.withArgs(body)
				.callsArg(1)
			mock.expects('updateOne')
				.once()
				.withArgs(body, {$set: {id:id}, $inc: docVersion: 1}, {upsert: true})
				.callsArg(3)
			subject.put body, (err) ->			
