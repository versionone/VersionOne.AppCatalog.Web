define ["backbone-min", "catalogApp"], (Backbone, catalogApp) ->
  catalogApp.EntryDetailsView = Backbone.View.extend(
    initialize: ->
      @model.bind "change", @render, this
    
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
      view.find(".details").html new catalogApp.EntryDetailsInfoView(model: entry).render().el
      view.find(".updates").html new catalogApp.EntryUpdatesView(model: @model.get("updates")).render().el
      
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

  catalogApp.EntryDetailsInfoView = Backbone.View.extend(render: ->
    entry = @model
    $(@el).html @template(entry)
    return this
  )

  catalogApp.EntryUpdatesView = Backbone.View.extend(render: ->
    updates = @model
    $(@el).html @template(updates)
    return this
  )