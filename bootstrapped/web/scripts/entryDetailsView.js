define(['backbone-min'], function(Backbone) {
    window.EntryDetailsView = Backbone.View.extend({
        initialize:function () {
            this.model.bind("change", this.render, this);
        },
        // Note, this is how it's called at the router level:
        // $("#content").html new EntryDetailsView(model: data).render().el
        render: function () {
            var entry = this.model.toJSON();
            var view = $(this.el);
            var html = this.template(entry);
            view.html(html);    
            view.find('.details').html(new EntryDetailsInfoView({model:entry}).render().el);
            view.find('.updates').html(new EntryUpdatesView({model:this.model.get('updates')}).render().el);

            view.find('.qualityBandPopover').each(function() {
                var popOver= $(this);
                var qualityBand = popOver.attr('data-qualityBand');
                var title = getPopTitle(qualityBand);
                var content = getPopContent(qualityBand);
                popOver.popover(
                    {
                      title: title,
                      content: content,
                      html: true,
                      animation: true
                    }
                );
            });
                
            function getPopTitle(target) {
                var selector = "#qualityBand" + target + "_title"; 
                var title = view.find(selector).html();
                return title;
            }

            function getPopContent(target) {
                var selector = '#qualityBand' + target + '_content'
                var content = view.find(selector).html();
                return content;
            }

            return this;
        }
    });

    window.EntryDetailsInfoView = Backbone.View.extend({
        render: function () {
            var entry = this.model;
            $(this.el).html(this.template(entry));
            return this;
        }
    });

    window.EntryUpdatesView = Backbone.View.extend({
        render: function () {
            var updates = this.model;
            $(this.el).html(this.template(updates));
            return this;
        }
    });
});