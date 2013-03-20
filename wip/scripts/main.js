requirejs.config({
	// The shim allows these non-AMD scripts to participate
	// in the AMDified loading for other modules
    shim: {
        'handlebars' : {
            exports: 'Handlebars'
        },
        'jquery.flexslider': {},
        'video': ['jquery'],
        'responsiveslides.min': ['jquery']
    }
});

require([
	    'handlebars',
        'jquery',
        'v1appCatalogEntries',
        'moment',
        'video',
        'responsiveslides.min',
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

        Handlebars.registerHelper('renderContent', function(content){
          return new Handlebars.SafeString(content);
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

        $(function () {
            $(".rslides").responsiveSlides({
                auto: false,
                pager: true,
                nav: true,
                speed: 500,
                maxwidth: 800,
                navContainer: '#navContainer',
                namespace: 'transparent-btns',
                before: function() {
                    videoControl(function(video) {
                        video.pause();
                    });
                }
            });
        });
        
        function videoControl(callback) {
            $('.video-js').each(function() {
                var id = $(this).attr('id');
                var video = _V_(id);
                callback(video);
            });
        }

        function resizeVideoJS(){
            var aspectRatio = 504/640;
            videoControl(function(video) {
                var width = document.getElementById(video.id).parentElement.offsetWidth;
                video.width(width).height(width * aspectRatio);
            });
        }
        resizeVideoJS();
        window.onresize = resizeVideoJS;
    }
);
