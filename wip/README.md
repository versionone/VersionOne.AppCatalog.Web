# Introduction

From the epic in V1 Production:

> One of the best ways to help excite the developer community is to make it easy for their contributions 
> to find their way into the hands of real users. An "App Catalog" provides us and the community with a 
> means to reach existing VersionOne customers without the bottlenecks of static content and gated content, 
> while improving the ability to find and explore existing applications. For now, "app" is anything that can 
> talk to VersionOne through any means (Core API, SDK.NET, SDK.Java, or otherwise); hence, the catalog is little 
> more than a "news feed" about apps. Over time, we can evolve the catalog and the notion of app to further 
> streamline distribution 
(a la iPhone, Chrome/Firefox, or other plug-in models).

[See E-02206 for more info](https://www7.v1host.com/V1Production/Epic.mvc/Summary?oidToken=Epic%3A365545)

# Live work-in-progress demo

[App Catalog working demo](http://versionone.github.com/VersionOne.AppCatalog.Web/wip/index.html?app=V1ClarityPPM](App Catalog)

# Iterations / release plan for App Catalog

1. Incrementally replace the currently static links from the [Platform Page](http://www.versionone.com/platform/), 
which link to static, manually updated SharePoint pages like (http://community.versionone.com/Downloads/Lists/Platform%20Downloads/DispForm.aspx?ID=42) 
with links to the App Catalog Detail view
2. Ultimately, add more of the UI and usage & popularity tracking gizmos depicted in the epic's `Elaborate` mockup. 
See [Item Details -- Elaborate](https://www7.v1host.com/V1Production/attachment.img/383377/03_Item_Details.png)
3. Implement the Search and List views for the App Catalog, and figure out how to incorporate into the VersionOne 
App itself to allow for users to browse and even purchase, and/or install integrations and other features directly 
into their instance.
4. Generalize the `App Catalog` concept enough that it can  be released under the new `Open Agile` banner as an 
MIT-licensed component for other people to benefit from and contribute toward.

# Technical Goals

* Learn about how to leverage cloud-based deployment options
* Leverage cross-platform technologies (Node.js instead of C# on the backend)
* Decrease the cycle-time for testing the app on the live internet
* Decrease the maintenance cost of hosting and associated configuration

# Developer Workflow

In order to get your app to appear and get updated in the VersionOne App Catalog, do this:

Assume that you are a developer working on the VersionOne Clairty PPM Integration.

1. Place a file named `catalog.json` (name is up for debate) into your repository 
**-- See catalog.json example below**
2. When you make a new release for this app, or make a change that you want to show up as a new "update", then add 
a new array item in the `updates` array at the bottom in the format of:

```json
"updates": [
    {
        "date": "2013-02-13T17:45:00.000Z", // Required
        "description": "stabilizing timesheet workflow", // Required
        "version": "0.3.2.13", // Optional
        "qualityBand": "sapling", // Optional
        "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip" // Optional
    }
]
}
```
3. Configure Jenkins to automatically publish the `catalog.json` document to the VersionOne App Catalog web service.
-- TODO

## Example catalog.json entry [(Source link)](https://github.com/versionone/V1ClarityPPM/blob/master/changelog.json)

```json
{
    "staticId": "http://versionone.com/v1clarityppm", // Required
    "name": "V1ClarityPPM", // Required
    "source": "VersionOne, Inc.",
    "summary": "A set of maps and processes for the Pervasive Data Integrator that can be used as building blocks for integrating VersionOne and Clarity PPM.",
    "description": "In many organizations, there is a tension between agile teams and their program management office (PMO). The agile teams struggle to report their work to the PMO, while the PMO struggles with monitoring agile projects. Both want tools that suit their particular needs but it is rare to find a combination that satisfies both interests. VersionOne's integration with Clarity PPM, built on the Pervasive Data Integrator, helps to ease this tension. The PMO can continue to manage the project in-take process using Clarity PPM's Demand Management features, while populating VersionOne's project structure when agile projects are ready to start. The PMO can maintain the bird's eye view of projects as a portfolio with automated project summary reporting from VersionOne that does not burden project managers with duplicate entry. The PMO can continue to leverage Clarity PPM's Resource Management features by populating time sheets from time-tracking in VersionOne. While these out-of-the-box integration capabilities help reduce the tension, Pervasive Data Integrator makes the integration easy to maintain and extend with visual designers for data mapping and automated workflows. That way, the integration can grow and evolve as both Agile and PPM processes evolve.",
    "cost": "Free",
    "support": [
        {
            "title": "Supported by VersionOne", // Required
            "href": "http://support.versionone.com/home" // Required
        }
    ],
    "textLinks": [
        {
            "title": "Download Latest Preview",
            "type": "download",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip"
        },
        {
            "title": "Source Code",
            "type": "source",
            "href": "https://github.com/versionone/V1ClarityPPM"
        },
        {
            "title": "Documentation",
            "type": "documentation",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/README.md"
        },
        {
            "title": "Modified BSD (3-clause) License",
            "icon": "license",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/LICENSE.md"
        },
        {
            "title": "Learn more about the Pervasive Data Integrator",
            "icon": "hyperlink",
            "href": "http://integration.pervasive.com/Products/Pervasive-Data-Integrator.aspx"
        }
    ],
    "visualLinks": [
        {
            "title": "Integration Workflows",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/gh-pages/images/IntegrationWorkflows.PNG?raw=true"
        },
        {
            "title": "Integration Video",
            "href": "http://vtv.v1host.com/permalink/?title=Clarity&category=Integrations&edition=enterprise&release=undefined"
        },
        {
            "title": "Reconcile Projects",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/gh-pages/images/ReconcileProjects.PNG?raw=true"
        },
        {
            "title": "Project Status Updates",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/gh-pages/images/ProjectStatusUpdates.PNG?raw=true"
        },
        {
            "title": "Mapping Designer",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/gh-pages/images/MappingDesigner.PNG?raw=true"
        },
        {
            "title": "Process Designer",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/gh-pages/images/ProcessDesigner.PNG?raw=true"
        }
    ],
    "qualityBands": [
        {
            "name": "seed",
            "shortDesc": "The initial idea of a product. No working code.",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#seed"
        },
        {
            "name": "sapling",
            "shortDesc": "The product is undergoing rapid growth. The code works but expect major changes.",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#sapling"
        },
        {
            "name": "mature",
            "shortDesc": "The product is stable. The code will continue to evolve with minimum breaking changes.",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#mature"
        }
    ],
    "updates": [
        {
            "date": "2013-02-13T17:45:00.000Z", // Required
            "description": "stabilizing timesheet workflow", // Required
            "version": "0.3.2.13", // Optional
            "qualityBand": "sapling", // Optional
            "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip" // Optional
        }
    ]
}
```



# Technical Implementation

## Front-End

* [Handlebars.js](http://handlebarsjs.com/) for HTML templates (MIT)
* [jQuery Mobile](http://jquerymobile.com/) for well-supported, responsive, HTML5-based views (MIT)
* [RequireJS](http://requirejs.org/) for AMD script loading (MIT or BSD)
* [ResponsiveSlides.js](http://responsive-slides.viljamis.com/) for image / video slider (MIT)
* [moment.js](http://momentjs.com/) for date parsing and formatting (MIT)
* [VideoJS](http://videojs.com) for embedding the V1TV Flash Videos (LGPL -- but we don't plan to 'redistribute' 
the JS file. See below...)

## Web Server

We're targetting Node.js running on Windows Azure. See this tutorial for more info for now:

[Create a Node.js Application on Windows Azure with MongoDB using the MongoLab Add-On]
(http://www.windowsazure.com/en-us/develop/nodejs/tutorials/website-with-mongodb-mongolab/)

## Data Storage

Azure has a partnership with MongoLabs. We are storing the JSON documents inside Mongo, hosted by MongoLabs. See more
info at [MongoLabs](https://mongolab.com/welcome/).

[Mongoose](http://www.mongoosejs.com) provides a sort of "ODM" for Node.js. Example:

```javascript
var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');

var schema = mongoose.Schema({ name: 'string' });
var Cat = mongoose.model('Cat', schema);

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});
```

# Code walkthrough

## Front-end

First, look at the [index.html](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/gh-pages/wip/index.html) 
file. Notice that the only script included explicitly is:

```html
<script 
        data-main="scripts/main.js"
        src="scripts/require.js"
        type="text/JavaScript">
</script>
```

This loads the RequireJS script loader, and tells RequireJS to use `main.js` for its "entry point". Here's the full
text of `main.js` as of now.

Important highlights:

1. The first line configures RequireJS by "shimming" the Handlebars, Video, and ResponsiveSlides scripts -- this 
tells RequireJS to wrap these libraries in order to make them consumable by other modules. The other modules in our
solution already support the [AMD pattern](http://requirejs.org/docs/whyamd.html) (Asynchronous Module Definition), 
and thus do not need any shim.

2. Next, the call to `require(['handlebars', 'jquery' ...` tells RequireJS to load all the modules specified, and, 
when finished, then call the callback passed as the second argument. We only declare argument names for a handful 
of the modules, because those are the only ones we need to interact with immediately.

TODO: add more explanation

```javascript
requirejs.config({
  // The shim allows these non-AMD scripts to participate
	// in the AMDified loading for other modules
    shim: {
        'handlebars' : {
            exports: 'Handlebars'
        }
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
        'jquery.mobile'
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

        function 
        (source, target) {
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

## REST web service

TODO with Greg's help

# App catalog deployment walthrough 

1. Remove the modules folder in Azure, so that it's verifiably empty
2. Make change to the App Catalog code itself locally
3. Use git from command-line to deploy it to Azure
4. Observe that Azure uses the `npm install` remotely in its log, indicating it is doing everything to install and 
run the new app
5. View the app catalog in browser

# End-to-end app catalog update walkthrough

1. Open up the V1ClarityPPM app catalog page and see its current state
2. Open up the MongoLabs monitor and see the database state for the V1ClarityPPM document
3. Make a change to the `catalog.json` file in the V1ClarityPPM project
4. Observe the build working in Jenkins
5. Inspect the document in MongoLabs
6. Reload the app catalog detail page


