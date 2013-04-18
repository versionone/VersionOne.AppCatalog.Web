define ["backbone-min", "catalogApp"], (Backbone, catalogApp) ->
  catalogApp.EntryModel = Backbone.Model.extend(url: ->
    "http://appcatalog.azurewebsites.net/entry?id=" + @id
  )
  return catalogApp.EntryModel
