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
  'responsiveslides.min': ['jquery']
  'bootstrap.min': ['jquery']
  video: ['jquery']

define 'catalogApp', [], () ->
  return {}

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
  'entryViews',
  'backbone-min',
  'bootstrap.min',
  'video', 
  'responsiveslides.min',
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
          catalogApp[view]::template = template
        , "html")
      else
        alert view + " not found"
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
        resizeVideoJS()
        initializeMediaSlider()
        $("#content").html new catalogApp.EntryDetailsView(model: entry).render().el
        # todo: betterize this:
        bindCatalogEntry data.attributes
  })

  '''
  The most important function is `bindCatalogEntry`. It takes care of formating the catalog entry and 
  populating / configuring the templated items with data, delegating most of the work to Handlebars templates, 
  and calling a few jQuery Mobile functions to enhance the HTML controls in their JQM-ified selves.
  '''
  bindCatalogEntry = (entry) ->
    # TODO fix these:
    #visualLinks = visualLinks: entry.visualLinks
    #runTemplate '#visualLinksTmpl', '.visualLinks', visualLinks

  initializeMediaSlider = ->
    $('.rslides').responsiveSlides
      auto: false
      pager: true
      nav: true
      speed: 500
      maxwidth: 800
      navContainer: '#navContainer'
      namespace: 'centered-btns'
      before: ->
        videoControl (video) ->
          video.pause()
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
  The `videoControl` function uses jQuery to match all elements with a class of `video-js` 
  so that we can pause and resize all instances of videos on the screen at once when navigating 
  with the `ResponseSlives.js` plugin.
  '''
  videoControl = (callback) ->
    $('.video-js').each ->
      id = $(this).attr('id')
      '''
      The crazy `_V_` function comes from the Video.js library, and it requires an id attribute 
      on elements to match.
      '''      
      video = _V_(id)
      callback video

  '''
  And, this provides responsive support for resizing the videos or images when the browser window size changes.
  '''
  resizeVideoJS = ->
    aspectRatio = 504 / 640 # TODO determine how to properly handle this
    videoControl (video) ->
      width = document.getElementById(video.id).parentElement.offsetWidth
      video.width(width).height width * aspectRatio

  '''
  Load the app now:
  '''
  window.onresize = resizeVideoJS
  resizeVideoJS()
  templateLoader.load ['EntryDetailsView', 'EntryDetailsInfoView', 'EntryUpdatesView'], ->
    app = new catalogApp.Router()  
    Backbone.history.start()