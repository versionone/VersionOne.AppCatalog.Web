define [
    'jquery',
    'backbone-min',    
    'catalogApp', 
    'responsiveslides', 
    'video'], ($, Backbone, catalogApp, responsiveSlides, videoJs) ->
    MAX_MEDIA_WIDTH = 0

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
        if MAX_MEDIA_WIDTH > 0 
            if width > MAX_MEDIA_WIDTH
                width = MAX_MEDIA_WIDTH
        video.width(width).height width * aspectRatio    

    window.onresize = resizeVideoJS

    initializeMediaSlider = (el) ->
        settings =
            auto: false
            pager: true
            speed: 500
            before: ->
                videoControl (video) ->
                    video.pause()

        if MAX_MEDIA_WIDTH > 0                    
            settings.maxwidth = MAX_MEDIA_WIDTH

        el.find('.rslides').responsiveSlides(settings)

    CinitializeMediaSlider = ->
        $('.carousel').bind 'slide', ->
            console.log 'slide'           
            videoControl (video) ->
                video.pause()
  
    catalogApp.MediaView = Backbone.View.extend(render: ->
        content = @template(@model)
        el = $(@el)
        el.html content
        initializeMediaSlider(el)
        resizeVideoJS()
        return @
    )

    return catalogApp.MediaView