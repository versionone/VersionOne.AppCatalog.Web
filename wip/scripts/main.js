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
        moment)
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

        var source   = $("#appCatalogEntryTmpl").html();
        var template = Handlebars.compile(source);
        var html    = template(v1appCatalogEntries);
        $('#appCatalogEntriesContainer').html(html);

        var source   = $("#qualityBandsTmpl").html();
        var template = Handlebars.compile(source);
        var html    = template(v1appCatalogEntries);
        $('#qualityBandsPlaceHolder').html(html);

        $('#updates').collapsible();
        $('.qualityBand').popup();
        $('.download').button();
        $('.textLinks').listview();

        $(document).ready(function() {
            $('.flexslider').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });
        });

        /*
        require(['v1assetEditor'], function(v1assetEditor) {
            $.mobile.initializePage();            
            window.v1AssetEditor = new v1assetEditor(v1config);
            window.v1AssetEditor.on("assetFormCreated", function(assetForm) {
                window.v1RequestForm = assetForm;
            });
        });
        */
	}
);