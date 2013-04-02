# App Catalog with Bootstrap and Backbone

This version of the App Catalog is built after reading Christopher Coenraets' [Sample App with Backbone.js and Twitter Bootstrap](http://coenraets.org/blog/2012/02/sample-app-with-backbone-js-and-twitter-bootstrap/) and studying and adapting the [accompanying app itself](https://github.com/ccoenraets/backbone-directory).

My version has some differences, including using RequireJS for loading scripts, and it is written in CoffeeScript. I also use Handlebars for templating, not the template function in Underscore. Additionally, I am pulling data from a Node.js service hosted in Windows Azure. That aspect is fairly inconsequential to the overall structure of the app, however. But, it is awesome how Backbone.Model makes it super easy to do without having to write a single line of code to do AJAX calls.

Here are some highlights about how it works.

# CoffeeScript and RequireJS for module loading

The index.html contains just a basic shell and links to some style files. All script loading is done with [RequireJS](http://requirejs.org/) and its configured `scripts\main.js` file. RequireJS supports the [Asynchronous Module Definition pattern](http://requirejs.org/docs/whyamd.html), and also provides some shimmery for scripts, like Backbone and Underscore themselves, which do not support the pattern. We'll see that next.

Just note the little, inconspicuous line:

```html
<div id="content" class="span12>"></div>
```
This single div will be where we inject the HTML into the app once our Backbone and Handlebars magic cast 
their spell on us.

# Full index.html shell content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>VersionOne App Catalog</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <style>
        body {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
        }
    </style>
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
</head>

<body>

<div class="container-fluid">
    <div class="row-fluid">
        <div id="content" class="span12>"></div>
    </div>

</div>

<script
    data-main='scripts/main.js'
    src='scripts/require.js'
    type='text/JavaScript'>
</script>

</body>
</html>
```

# Loading the app from main

This brings us to `scripts/main.coffee`, from which all else flows. While the code may change if you look at the HEAD revision, the rest of this post refers to [this commit of main.coffee](https://github.com/versionone/VersionOne.AppCatalog.Web/tree/a3da61d96c018d3689d4827d4d329b9e44d84c91/bootstrapped/web).

First, we configure RequireJS with some `shim` settings to set up Handlebars, Underscoe, Backbone, ResponsiveSlides, and Bootstrap to behave as if they supported AMD natively.

```coffee
requirejs.config shim:
  handlebars:
    exports: 'Handlebars'
  'underscore-min':
    exports: '_'
  'backbone-min': 
    deps: ['underscore-min']
    exports: 'Backbone'
  'responsiveslides.min': ['jquery']
  'bootstrap.min': ['jquery']
  video: ['jquery']
```

Now, we define an empty module named `catalogApp` that will come in handy soon enough to help us avoid polluting the global namespace.

Not much to see here:

```coffee
define 'catalogApp', [], () ->
  return {}
```

Next, we call the `require` function and pass in all the modules we want loaded by their name. RequireJS automatically looks for them in the same folder that `main.js` (the compiled version of main.coffee) resides, and automatically puts the `.js` on the end of them.

```coffee
require [
  'handlebars', 
  'jquery', 
  'moment',
  'entryModel',
  'catalogApp',
  'entryViews',
  'backbone-min',
  'bootstrap.min',
  'video', 
  'responsiveslides.min',
  ], (Handlebars, $, moment, EntryModel, catalogApp) ->
```
# Sequential flow of execution

Let's walk through the rest of the execution sequentially and highlight the code as we encounter it.

First, RequireJS reads the `data-main` attribute of the script tag it was contained with, and then it loads that script, `scripts/main.js`. Once we make the call to `require` just show above, it will go out and try to load all the modules we asked it for. In the process of doing that, those modules might require modules of their own. It will attempt to load as many of the scripts it can asynchronously from the full set of requirements it finds, but will only call the callback function that we passed as the second argument when each dependent requirement script has loaded.

Second, at the end of the script we ask `templateLoader` to load the HTML templates for Handlebars:

```coffee
templateLoader.load ['EntryDetailsView', 'EntryDetailsInfoView', 'EntryUpdatesView'], ->
  app = new window.Router()  
	Backbone.history.start()
```

This is a neat little chunk of code that I adapted directly from the original application from Christopher, but I changed it to compile the templates with Handlerbars, not the template compiler inside of Underscore. And, I made it look for views by name inside of the `catalogApp` object that I introduced above. We'll see where that gets populated in the next section.

```coffee
templateLoader = load: (views, callback) ->
    deferreds = []
    $.each viewNames, (index, view) ->
      if catalogApp[view]
        deferreds.push $.get("tpl/" + view + ".html", (data) ->
          template = Handlebars.compile(data)
          # This creates a property inside the view by the same name:
          catalogApp[view]::template = template
        , "html")
      else
        alert view + " not found"
    $.when.apply(null, deferreds).done callback
```
To understand this chunk of code, we need to understand the concept of a [deferred object](http://api.jquery.com/category/deferred-object/) in jQuery. Quoting from the API reference:

> jQuery.Deferred is a constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.

When we call `$.get('tpl/EntryDetailsView.html', ...)` we get back an instance that implements the Deferred interface. By adding it to the `deferreds` array, we can then *apply* the `$.when()` function to execute the `callback` function we pass it only after all elements of the array are finished. That's what we're doing by passing `callback` to the `.done` function returned by calling `$.when()`. Remember that in the context of this call, `callback` is the code we just saw in the last section.

However, before that gets called, each call to `$.get()` results in executing this block:

```coffee
template = Handlebars.compile(data)
# This creates a property inside the view by the same name:
catalogApp[view]::template = template
```

At first, this looks a little hard to comprehend. How can `window[view]` actually resolve to anything?

To understand this, let's recall that we have, by this point, already loaded the module named `entryViews`. Inside of `entryViews.coffee` is this code:

```coffee
define ["backbone-min", "catalogApp"], (Backbone, catalogApp) ->
  catalogApp.EntryDetailsView = Backbone.View.extend(
	# omitted
  )

  catalogApp.EntryDetailsInfoView = Backbone.View.extend(
	# omitted
  )

  catalogApp.EntryUpdatesView = Backbone.View.extend(
	# omitted
  )
```

The original application stored the views directly inside of `window`, but I prefer to avoid polluting the global namespace as best as I can. So, since the `entryViews` module loads first before our callback, `catalogApp` has already been populated with views by name.

> **Note:** You might say we could have split those views out if we wanted to. Or, we could bundle and minify multiple views from a server-side compilation step. I agree, and thats's left for another iteration.

So, now this line makes total sense in context:

```coffee
catalogApp[view]::template = template
```
For the first view we ask for, `EntryDetailsView`, it evaluates to:

```coffee
catalogApp['EntryDetailsView']::template = template
```

Note that `::` is a shortcut in CoffeeScript for the `prototype` of a constructor function object. This ensures that all instances that we new up by calling `var instance = new catalogApp.EntryDetailsView(...)` will have a `template` property pointing to the compiled Handlebars template. Pretty awesome.

# Initializing the Router

Wow, that was a lot of bootup code for out backstrap app!

We're finally at these two lines:

```coffee
app = new catalogApp.Router()  
Backbone.history.start()
```
Here's the definition of `catalogApp.Router`:

```coffee
catalogApp.Router = Backbone.Router.extend({
	routes: 
	  "entries/:id": "entryDetails"
	  "": "home"
	home: () ->
	  this.entryDetails('v1clarityppm') # redirect to a known good id
	entryDetails: (id) ->
	  entry = new catalogApp.EntryModel(id: "http://versionone.com/" + id)    
	  entry.fetch success: (data) ->
	    resizeVideoJS()
	    initializeMediaSlider()
	    $("#content").html new catalogApp.EntryDetailsView(model: data).render().el
	    # todo: betterize this:
	    bindCatalogEntry data.attributes
})
```
By extending [Backbone.Router](http://backbonejs.org/#Router), we get access to Backbone's URL and History API support. From the Backbone docs:

> Web applications often provide linkable, bookmarkable, shareable URLs for important locations in the app. Until recently, hash fragments (`#page`) were used to provide these permalinks, but with the arrival of the History API, it's now possible to use standard URLs (`/page`). Backbone.Router provides methods for routing client-side pages, and connecting them to actions and events. For browsers which don't yet support the History API, the Router handles graceful fallback and transparent translation to the fragment version of the URL.
>
> During page load, after your application has finished creating all of its routers, be sure to call `Backbone.history.start()`, or `Backbone.history.start({pushState: true})` to route the initial URL.

When we extend it, we are setting up our routes, one for the `home` route and one for the `entries/:id` route, which will match a URL like `entries/v1clarityppm`. In fact, we just redirect there from home for now, since that's all this app does so far, and that's the one record we have in our MongoDB instance.

# Fetching data from hosted MongoDB by extending Backbone.Model

This is actually my favorite part of the whole app. This highlighted code makes me a happy camper:

```coffee
entryDetails: (id) ->
  entry = new catalogApp.EntryModel(id: "http://versionone.com/" + id)    
  entry.fetch success: (data) ->
	# omitted
    $("#content").html new catalogApp.EntryDetailsView(model: data).render().el
	# omitted
})
```

To understand this in its full context, here is `entryModel.coffee`:

```coffee
define ["backbone-min", "catalogApp"], (Backbone, catalogApp) ->
  catalogApp.EntryModel = Backbone.Model.extend(url: ->
    "http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=" + @id
  )
  return catalogApp.EntryModel
```

We simply extend [Backbone.Model](http://backbonejs.org/#Model), and override its `url` function to provide our own implementation. We prefix the id property of the model with the URL for our hosted Node.js service, which itself calls upon a hosted MongoDB instance that lives in MongoLabs. Because the shape of the data that comes back from that call is standard JSON, we have a full-fledged Backbone Model at our service now!

Backbone models support the `fetch` method, which uses AJAX to query a remote URL and then populate the instance with the returned data. Internally, Backbone delegates to jQuery (or Zepto) to perform AJAX calls.

For us, the call to [http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=http://versionone.com/v1clarityppm](http://appcatalog.azurewebsites.net/appcatalog/entries?staticId=http://versionone.com/v1clarityppm) returns the following JSON representation of the catalog entry:

```json

  "staticId": "http:\/\/versionone.com\/v1clarityppm",
  "name": "V1ClarityPPM",
  "source": "VersionOne, Inc.",
  "summary": "Synchronize Clarity PPM items with VersionOne work items",
  "description": "V1ClarityPPM is a set of maps and processes for the Pervasive Data Integrator that can be used as building blocks for integrating VersionOne and Clarity PPM. Although these maps and processes require the commercial Pervasive Data Integrator product, the maps and processes themselves are free, licensed under a modified BSD license, which reflects our intent that anyone can use the maps and processes without any obligations.",
  "cost": "Free",
  "_id": "5155f620917c1f7013000006",
  "__v": 0,
  "updates": [
    {
      "date": "2013-02-13T17:45:00.000Z",
      "description": "stabilizing timesheet workflow",
      "version": "0.3.2.13",
      "qualityBand": "mature",
      "downloadUrl": "http:\/\/platform.versionone.com.s3.amazonaws.com\/downloads\/v1clarityppm_0.3.2.13.zip",
      "_id": "5155f620917c1f7013000008"
    },
	// etc
  ],
  "qualityBands": [
    {
      "name": "seed",
      "shortDesc": "The initial idea of a product. No working code.",
      "href": "https:\/\/github.com\/versionone\/V1ClarityPPM\/blob\/master\/CONTRIBUTING.md#seed",
      "_id": "5155f620917c1f701300000b"
    },
	// etc
  ],
  "visualLinks": [
    {
      "title": "Video",
      "isCustom": true,
      "content": "<video id='video1' class='video-js vjs-default-skin' controls preload='none' poster='content\/gallery\/ClaritySplash.png' data-setup='{}'><source src='http:\/\/www.versionone.tv.s3.amazonaws.com\/Clarity\/Clarity.flv' type='video\/flv'><\/video>",
      "_id": "5155f620917c1f7013000011"
    },
	
  ],
  "textLinks": [
    {
      "title": "Download Latest Preview",
      "href": "http:\/\/platform.versionone.com.s3.amazonaws.com\/downloads\/v1clarityppm_0.3.2.13.zip",
      "type": "download",
      "_id": "5155f620917c1f7013000015"
    },
	// etc
}
```

Finally, this last call takes us all the home to the first HTML shell in `index.html`:

```coffee
$("#content").html new catalogApp.EntryDetailsView(model: data).render().el
```
Here, we instantiate the `EntryDetailsView`, and pass it the model that we just got back from the Windows Azure site, and then we render it into the DOM.

The bulk of the sophisticated code actually resides inside this `EntryDetailsView` class! Here it is, along with the two other views defined in `entryViews.coffee`:

```coffee
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
```

This code is actually pretty simple. You can study up on [Backbone View](http://backbonejs.org/#View) at the Backbone web site for full understanding. In brief, we define the `render` function so that the code we just explained can render itself properly. Within this, we define a couple of helper functions that we use in conjunction with Twitter Bootstrap's [popover JavaScript component](http://twitter.github.com/bootstrap/javascript.html#popovers). That allows us to render hidden HTML elements for the `qualityBands` array that came back in our JSON document. And, when the user clicks on the link for the definition of a given quality band, it pops over the link with a small box with a title and full description.

# Concluding code

This is very much an app in progress, and the carousel feature is not yet in operation. We're actively porting this from a prototype we did with jQuery Mobile into this version with Twitter Bootstrap. As such, we've not really taking much advantage of Bootstrap's features much in this article.

However, I leave you with the code of the Handlebars HTML templates, which showcase some of the Bootstrap classes and conventions:

# EntryDetailsView.html 


```html
<style type='text/css'>
    .qualityBand {
        display:none;
    }
</style>
<p>
    <h1>{{name}}</h1>
    {{summary}}
</p>
{{#each qualityBands}}
<div id='qualityBand{{name}}' class='qualityBand' style='max-width:350px;'>
    <div id='qualityBand{{name}}_title'>
        {{name}}
    </div>
    <div id='qualityBand{{name}}_content'>
        {{shortDesc}} <a href='href' target='_blank'>more..</a>
    </div>
</div>
{{/each}}
<div>
    <div class='visualLinks'></div>
    <div>
        <div class='details'></div>
        <div class='updates'></div>
    </div>
</div>
```

The first part is where the hidden qualityBand elements get rendered, to be used later for the popover effects just described. The last `div` is actually just a wrapper for three other sections.

# EntryDetailsInfoView.html

This is the section that gets rendered with the basic info and textual links from the catalog entry:

```html
<h2>Details</h2>
<p><a href='{{support.href}}'>{{support.title}}</a></p>
<p><b>Cost:</b> {{cost}}</p>
<p>{{description}}</p>
<ul class='textLinks nav nav-tabs nav-stacked'>
    {{#each textLinks}}
        <li>
            <a href="{{href}}">
                <img src="img/{{type}}.png">
                {{title}}
            </a>
        </li>
    {{/each}}
</ul>

```

# EntryUpdatesView.html

And, for now the last view renders the `updates` array from the catalog entry:

```html
<h2>All Releases</h2>
{{#each this}}
    <div>
        <div>
            <p>{{dateFormat date}} - {{version}}</p>
            <p>{{description}}</p>
        </div>
        <div>
            <p>Quality Band: <a 
                data-qualityBand='{{qualityBand}}'
                class='qualityBandPopover'
                >{{qualityBand}}</a>
            </p>
            <p>
                <a
                    href="{{downloadUrl}}"
                    class='btn download'
                >Download</a>
            </p>
        </div>
    </div>
    <hr />
{{/each}}
```
# Take a test drive

At least, see the work in progress at [http://versionone.github.com/VersionOne.AppCatalog.Web/bootstrapped/web/#entries/v1clarityppm](http://versionone.github.com/VersionOne.AppCatalog.Web/bootstrapped/web/#entries/v1clarityppm). 

Note, since we're using the free version of Windows Azure right now, sometimes there is latency when connecting to it. *Actually, I'm not sure if it's because of Azure or MongoDB, which is downstream from the call to Azure*.
