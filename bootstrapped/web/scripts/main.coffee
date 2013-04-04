'''
RequireJS provides Asynchronous Module Definition loading, but we first must configure a few of our libraries to work with it. This includes Handlebars because it does not support AMD natively. The `shim` argument configures 
RequireJS to wrap scripts so that other modules can use them as injected, modular dependencies.

For `Video.js` and `ResponseSlives.js`, specify that they depend upon `jQuery`.
'''

requirejs.config shim:
  handlebars:
    exports: 'Handlebars'
  'underscore-min':
    exports: '_'
  'backbone-min': 
    deps: ['underscore-min']
    exports: 'Backbone'
  'responsiveslides': ['jquery']
  'bootstrap.min': ['jquery']
  video: ['jquery']

define 'catalogApp', [], () ->
  catalogApp = 
    templates: {}
    
    associateViewWithTemplate: (viewName, template)->
      @[viewName]::template = template

    renderView: (viewName, data) ->
      if @[viewName]?
        val = new @[viewName](model: data).render().el
        return val
      else
        content = @renderTemplate viewName, data
        return content

    createTemplate: (name, source)->
      template = Handlebars.compile(source)
      @templates[name] = template

    renderTemplateSafeString: (name, data)->
      content = @templates[name](data)
      return new Handlebars.SafeString(content)

    renderTemplate: (name, data)->
      content = @templates[name](data)
      return content

  return catalogApp

'''
Now, we configure this `main` module by specifing which modules it needs to operate by calling the 
`require` function and passing in an array of modules to inject. 

Notice that we only declare three formal arguments because those are the only ones we actually need to 
reference in our initialization function, but since event handler and other UI code requires the other 
libraries, we ensure that they get loaded now before initialization.
'''

require [
  'handlebars', 
  'jquery',
  'moment',
  'entryModel',
  'catalogApp',
  'responsiveslides',
  'entryViews',
  'mediaView',
  'backbone-min',
  'bootstrap.min',
  ], (Handlebars, $, moment, EntryModel, catalogApp) ->
  '''
  When all the modules are injected, we will use jQuery's AJAX support through `$.get` to fetch the 
  data from our Windows Azure hosted REST service. Internally, the web service pulls the data out of MongoDB, 
  which is itself hosted via MongoLabs.
  
  But, we do need to declare and initialize our functions first.
  '''

  '''
  To load external template files, we use this function, which relies on some great asynchronous convenience 
  functions in jQuery
  '''
  templateLoader = load: (viewNames, callback) ->
    deferreds = []
    $.each viewNames, (index, view) ->
      if catalogApp[view]
        deferreds.push $.get("tpl/" + view + ".html", (data) ->
          template = Handlebars.compile(data)
          # This creates a property inside the view by the same name:
          catalogApp.associateViewWithTemplate view, template
        , "html")
      else
        console.log view + " not found, adding to catalogApp.templates instead"
        if not catalogApp.templates
          catalogApp.templates = {}
        deferreds.push $.get("tpl/" + view + ".html", (data) ->
          catalogApp.createTemplate(view, data)
        , "html")
    $.when.apply(null, deferreds).done callback

  catalogApp.Router = Backbone.Router.extend({
    routes: 
      "": "home"      
      "entries/:id": "entryDetails"
    home: ->
      this.entryDetails('v1clarityppm') # redirect to a known good id
    entryDetails: (id) ->
      entry = new catalogApp.EntryModel(id: "http://versionone.com/" + id)    
      entry.fetch success: ->
        $("#content").html catalogApp.renderView 'EntryDetailsView', entry
  })
 
  '''
  This utility function makes calling Handlebars templates easier.
  '''
  runTemplate = (source, target, data) ->
    source = $(source).html()
    template = Handlebars.compile(source)
    html = template(data)
    $(target).html html
  '''
  Register some formatting helpers for Handlebars to handle dates and the custom video tag content from our schema.
  '''
  # format an ISO date using Moment.js
  # http://momentjs.com/
  # moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
  # usage: {{dateFormat creation_date format="MMMM YYYY"}}
  # When moment plugin not available, return data as is.
  Handlebars.registerHelper 'dateFormat', (context, block) ->
    if window.moment
      f = block.hash.format or 'MMM DD, YYYY'
      return moment(context).format(f)
    else
      return context

  Handlebars.registerHelper 'renderContent', (content) ->
    new Handlebars.SafeString(content)

  '''
  Load the app now:
  '''
  templateLoader.load ['EntryDetailsView', 'TitleView', 'MediaView', 'QualifiersView', 'CallToActionView', 'EntryDetailsInfoView', 'EntryUpdatesView'], ->
    $ ->
      app = new catalogApp.Router()
      Backbone.history.start()