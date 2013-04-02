define ["backbone-min", "catalogApp"], (Backbone, catalogApp) ->
  catalogApp.EntryModel = Backbone.Model.extend(url: ->
    "http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=" + @id
  )
  return catalogApp.EntryModel
