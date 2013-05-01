define ["backbone-min", "catalogApp", "handlebars"], (Backbone, catalogApp, Handlebars) ->
  Handlebars.registerHelper 'callToAction', (context, block) ->    
    callToAction = context.textLinks[0]
    return catalogApp.renderTemplateSafeString('CallToActionView', callToAction)

  catalogApp.EntryDetailsView = Backbone.View.extend(
    initialize: ->
      @model.bind 'change', @render, @
    
    # Note, this is how it's called at the router level:
    # $("#content").html new EntryDetailsView(model: data).render().el
    render: ->
      getPopTitle = (target) ->
        selector = "#qualityBand" + target + "_title"
        title = view.find(selector).html()
        return title
      
      getPopContent = (target) ->
        selector = "#qualityBand" + target + "_content"
        content = view.find(selector).html()
        return content
      
      entry = @model.toJSON()
      view = $(@el)
      html = @template(entry)

      view.html html      
      view.find('.entryTitle').html catalogApp.renderView('TitleView', entry)
      view.find('.qualifiers').html catalogApp.renderView('QualifiersView', entry)
      view.find('.media').html catalogApp.renderView('MediaView', @model.get('visualLinks'))
      view.find('.details').html catalogApp.renderView('EntryDetailsInfoView', entry)
      view.find('.updates').html catalogApp.renderView('EntryUpdatesView', @model.get('updates'))
      
      view.find(".qualityBandPopover").each ->
        popOver = $(this)
        qualityBand = popOver.attr("data-qualityBand")
        title = getPopTitle(qualityBand)
        content = getPopContent(qualityBand)
        popOver.popover
          title: title
          content: content
          html: true
          animation: true
      return this
  )