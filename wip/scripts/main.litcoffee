RequireJS provides Asynchronous Module Definition loading, but we first must configure a few of our libraries to work with it. This includes Handlebars because it does not support AMD natively. The `shim` argument configures 
RequireJS to wrap scripts so that other modules can use them as injected, modular dependencies.

  requirejs.config shim:
    handlebars:
      exports: 'Handlebars'

For `Video.js` and `ResponseSlives.js`, specify that they depend upon `jQuery`.

    video: ['jquery']
    'responsiveslides.min': ['jquery']

Now we are ready to configure this `main` module by specifing which modules it needs to operate by calling the `require` function and passing in an array of modules to inject. Notice that we only declare three formal arguments because those are the only ones we actually need to reference in our initialization function, but since event handler and other UI code requires the other libraries, we ensure that they get loaded now before initialization.

  require ["handlebars", "jquery", "moment", "video", "responsiveslides.min", "jquery.mobile"], (Handlebars, $, moment) ->

    # format an ISO date using Moment.js
    # http://momentjs.com/
    # moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
    # usage: {{dateFormat creation_date format="MMMM YYYY"}}
    #had to remove Date(context)
    # moment plugin not available. return data as is.
    Handlebars.registerHelper "dateFormat", (context, block) ->
      if window.moment
        f = block.hash.format or "MMM DD, YYYY"
        return moment(context).format(f)
      else
        return context

    Handlebars.registerHelper "renderContent", (content) ->
      new Handlebars.SafeString(content)  
        
    # Main module execution
    #
    #        var appName = qs('app');
    #        if (appName != null) {        
    #            $.each(v1appCatalogEntries, function(index, item) {
    #                if (item.name.toLowerCase() == appName.toLowerCase()) {
    #                    selectedEntry = item;
    #                    bindCatalogEntry(selectedEntry);
    #                }
    #            });
    #        }
    #        if (selectedEntry == null) {
    #            runTemplate("#appCatalogEntryListTmpl", '#appCatalogEntryList');
    #        }
    #        else {
    #            $('#appCatalogEntryList').remove();
    #        }        
    #        
    qs = (variable) ->
      query = window.location.search.substring(1)
      vars = query.split("&")
      i = 0
      while i < vars.length
        pair = vars[i].split("=")
        return decodeURIComponent(pair[1])  if decodeURIComponent(pair[0]) is variable
        i++
      console.log "Query variable %s not found", variable
    
    runTemplate2 = (source, target, data) ->
      source = $(source).html()
      template = Handlebars.compile(source)
      html = template(data)
      $(target).html html
    
    bindCatalogEntry = (entry) ->
      runTemplate2 "#appCatalogEntryTmpl", "#appCatalogEntry", entry
      $(".updates").collapsible()
      $(".download").button()
      $(".textLinks").listview()
      $(".qualityBand").popup()
      visualLinks = visualLinks: entry.visualLinks
      runTemplate2 "#visualLinksTmpl", ".visualLinks", visualLinks
    
    videoControl = (callback) ->
      $(".video-js").each ->
        id = $(this).attr("id")
        video = _V_(id)
        callback video

    resizeVideoJS = ->
      aspectRatio = 504 / 640
      videoControl (video) ->
        width = document.getElementById(video.id).parentElement.offsetWidth
        video.width(width).height width * aspectRatio

    selectedEntry = null
    $.get("http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=http://versionone.com/v1clarityppm").done (data) ->
      window.onresize = resizeVideoJS
      resizeVideoJS()      
      bindCatalogEntry data
      $("#appCatalogEntryList").remove()
      $(".rslides").responsiveSlides
        auto: false
        pager: true
        nav: true
        speed: 500
        maxwidth: 800
        navContainer: "#navContainer"
        namespace: "transparent-btns"
        before: ->
          videoControl (video) ->
            video.pause()
    '''
    $("#entryList").change (evt, target) ->
      selectedIndex = $(this).val()
      $("#appCatalogEntry").fadeOut "fast", ->
        $("#appCatalogEntry").empty()
        entry = v1appCatalogEntries[selectedIndex]
        bindCatalogEntry entry
        $("#appCatalogEntry").fadeIn()
    '''
