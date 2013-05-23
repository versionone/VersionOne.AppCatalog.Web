requireCover = require('./requireCover')('app')
sarcastic = requireCover 'sarcastic'
must = sarcastic.must
should = require 'should'
sinon = require 'sinon'

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
#		console.log 'we saved'
#		saveCalled = true
	this.find = ->
	this.findOne = ->
	this.update = ->
	this.validate = ->

# Configure sarcastic to mock AppCatalogyEntry with
# our custom mock, all the way down to Node's module loader,
# because inside of service.coffee, 
# it uses: AppCatalogEntry = require './appCatalogEntry'
sarcastic.configTarget './appCatalogEntry', MockAppCatalogEntry

# Our actual subject under test is the service class
subject = requireCover 'service'

describe 'service', ->
	
	describe '#findAll', ->
		must 'call find', ->
			sarcastic.getMock().expects('find').once().withArgs {}, ''
			subject.findAll()

	describe '#findById', ->
		must 'call findOne', ->
			id = 'v1clarityppm'
			sarcastic.getMock().expects('findOne').once().withArgs { id: id }, ''
			subject.findById id

	describe '#put', ->
		must 'call validate and update', ->
			id = 'v1clarityppm'
			body = { id: id }			
			mock = sarcastic.getMock()

			sarcastic.getMock()
				.expects('update')
				.once()
				.withArgs({ id: id }, {$set: {id:id}, $inc: docVersion: 1}, {upsert: true})
				.callsArg(3)
			sarcastic.getMock()
				.expects('validate')
				.once()
				.withArgs(body)
				.callsArg(1)
			subject.put { id: id }, (err) ->			