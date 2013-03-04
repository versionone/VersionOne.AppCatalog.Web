requirejs.config({
	// The shim allows these non-AMD scripts to participate
	// in the AMDified loading for other modules
    shim: {
        'handlebars' : {
            exports: 'Handlebars'
        },
        'jquery.flexslider': {}
    }
});

require([
	    'handlebars',
        'jquery',
        'v1appCatalogEntries',
        'moment',
        'jquery.mobile',
        'jquery.flexslider'
    ],
    function(
        Handlebars,
        $,
        v1appCatalogEntries,
        moment
    )
    {
        // format an ISO date using Moment.js
        // http://momentjs.com/
        // moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
        // usage: {{dateFormat creation_date format="MMMM YYYY"}}
        Handlebars.registerHelper('dateFormat', function(context, block) {
            if (window.moment) {
                var f = block.hash.format || "MMM DD, YYYY";
                return moment(context).format(f); //had to remove Date(context)
            } else {
                return context; // moment plugin not available. return data as is.
            };
        });

        var selectedEntry = null;
        
        // Main module execution
        var appName = qs('app');
        if (appName != null) {        
            $.each(v1appCatalogEntries, function(index, item) {
                if (item.name.toLowerCase() == appName.toLowerCase()) {
                    selectedEntry = item;
                    bindCatalogEntry(selectedEntry);
                }
            });
        }

        if (selectedEntry == null) {
            runTemplate("#appCatalogEntryListTmpl", '#appCatalogEntryList');
        }
        else {
            $('#appCatalogEntryList').remove();
        }

        function qs(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', variable);
        }

        function runTemplate(source, target) {
            var source   = $(source).html();
            var template = Handlebars.compile(source);
            var html    = template(v1appCatalogEntries);
            $(target).html(html);
        }

        function runTemplate2(source, target, data) {
            var source   = $(source).html();
            var template = Handlebars.compile(source);
            var html    = template(data);
            $(target).html(html);
        }

        function bindCatalogEntry(entry) {
            runTemplate2("#appCatalogEntryTmpl", '#appCatalogEntry', entry);
            $('.updates').collapsible();
            $('.download').button();
            $('.textLinks').listview();    
            $('.qualityBand').popup();

            var visualLinks = { visualLinks: entry.visualLinks };
            runTemplate2('#visualLinksTmpl', '.visualLinks', visualLinks);
            $('.flexslider').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });
        }

        $('#entryList').change(function(evt, target) {
            var selectedIndex = $(this).val();
            $('#appCatalogEntry').fadeOut('fast', function() {
                $('#appCatalogEntry').empty();                
                var entry = v1appCatalogEntries[selectedIndex];
                bindCatalogEntry(entry);
                $('#appCatalogEntry').fadeIn();
            });
        });       
	}
);