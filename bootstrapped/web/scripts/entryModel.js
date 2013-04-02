define(['backbone-min'], function (Backbone) {
    window.EntryModel = Backbone.Model.extend({
        url: function() {
            return 'http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=' + this.id;
        }
    });
    return window.EntryModel;
});