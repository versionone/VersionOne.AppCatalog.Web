# Technical Details

App Catalog is comprised of several major parts:

* Gherkin Feature files describing the original intentions for the system scenarios (not used for automation)
* UI built with AngularJS
* Karma and Jasmin provide client-side testing
* REST service made with Node.js, Express, and hosted on Windows Azure
* Document storage in MongoDB, hosted on MongoLab, and abstracted by Mongoose.js and a bit of JSON Schema
* Mocha and Sinon for server-side testing
* JSCoverage and the Cobertura and Test Anything Protocol (TAP) Jenkins plugins for code coverage reports

There is a lot to cover, so let's start by looking at one of the Gherkin files, and then follow the path of two kinds
of users, a pulisher, and a site visitor, following the execution all the way down to MongoDB.

After that, we'll look more closely at the Jenkins configuration and the physical deployment of the system.

The remaining details will zoom into interesting technical details about different parts like testing and AngularJS.

# How to Publish an Entry

Using cURL, you can PUT a catalog entry into the catalog if you specify the password like so:

```bash
curl -X PUT http://appcatalogstage.azurewebsites.net --user catUser:CatsRUs @product.json -H "Content-Type: application/json"
```
# Deep dive on Publish an Entry

The `product.json` file must contain JSON that conforms to the JSON Schema defined in [appCatalogEntry.coffee](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/src/server/app/appCatalogEntry.coffee#L64). Here's an excerpt of the [TFS example entry](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/src/server/test/examples/tfs.product.json):

```json
{
    "id": "VersionOne.V1TFS",
    "titleSection": {
        "name": "V1TFS",
        "shortDescription": "Links VersionOne Workitems to TFS Check-ins and Builds.",
        "pricing": "Free",
        "support": {
            "text": "VersionOne",
            "href": "http://support.versionone.com/home"
        }
    },
    "descriptionSection": {
        "description": "V1TFS links VersionOne Workitems to TFS Check-ins and Builds. The link from Workitems to Check-ins makes it easier to track down the source of a defect and perform code reviews. The link from Workitems to Builds enables teams to measure progress in terms of working software and to identify problems sooner. Using the links from Workitems to Builds, the VersionOne BuildRun Report can help a Release Manager select an appropriate build for release and can be the starting point for release notes."
    },
    "linksSection": [
        {
            "type": "download",
            "title": "Download Latest Stable Build",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/V1TFS2012.zip"
        },
        {
            "type": "source",
            "title": "Source Code",
            "href": "https://github.com/versionone/V1TFS"
        }
    ],
    "updatesSection": {
        "updates": [
            {
                "date": "2012-11-01T00:00:00.000Z",
                "description": "Fall 2012",
                "version": "97",
                "releaseNotes": "Added: Support for TFS 2012",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/V1TFS2012.zip"
            },
            {
                "date": "2010-11-14T00:00:00.000Z",
                "description": "Initial Release",
                "version": "52",
                "qualityBand": "sapling"
            }
        ],
        "qualityBands": [
            {
                "name": "seed",
                "shortDesc": "The initial idea of a product. No working code.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#seed"
            },
            {
                "name": "sapling",
                "shortDesc": "The product is undergoing rapid growth. The code works but expect major changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#sapling"
            },
            {
                "name": "mature",
                "shortDesc": "The product is stable. The code will continue to evolve with minimum breaking changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#mature"
            }
        ]
    },
    "mediaSection": [
        {
            "title": "TFS Integration",
            "caption": "Integrate code check-ins and builds created by Microsoft's Team Foundation Server into VersionOne.",
            "mimetype": "video/x-flv",
            "href": "http://vtv.v1host.com/permalink/?title=SCM%20%26%20Build%3A%20Microsoft%20TFS&category=Integrations&edition=enterprise&release=undefined",
            "thumbhref": "http://community.versionone.com/attachments/imagefolder/gettingstarted/video.png"
        }
    ]
}
```
## JSON Schema excerpt

Below is an excerpt from the full schema. JSON Schema has an interesting structure. It's mostly straight-forward,
though notice that in the definition of `updatesSection\updates` that the list of `required` properties is separated out from the definition of properties themselves. I still am not exactly sure why they redesigned it this way, because earlier version of JSON Schema appeared to let you define a property as required in-line.

Also notice `qualityBands\patternProperties`. This allows you specify a regular expression that all property names of the object must match. The adjacent `minProperties: 1` means that the object must contain **at least one property**. Now, each of the properties themselves must be of type `object` and conform to the schema defined for it.

```coffee
updatesSection:
  type: 'object'
	required: ['updates', 'qualityBands']
	properties:
		updates:
		  type: 'array'
		  items:
		    type: 'object'
		    required: ['date', 'description', 'version']
		    properties:
		      date:
		        type: 'string'
		        format: 'date-time'
		        maxLength: 100
		      description:
		        type: 'string'
		        maxLength: 1000
		      version:
		        type: 'string'
		        maxLength: 50
		      releaseNotes:
		        type: 'string'
		        maxLength: 1000
		      moreInfoUrl:
		        type: 'string'
		        maxLength: HREF_MAX_LENGTH
		      qualityBand:
		        type: 'string'
		        maxLength: 50
		      downloadUrl:
		        type: 'string'
		        maxLength: HREF_MAX_LENGTH
qualityBands:
	minProperties: 1
	patternProperties:
		"^.*$":
		  type: 'object'
		  required: ['name', 'shortDescription', 'href']
		  properties:
		    name:
		      type: 'string'
		      maxLength: 100
		    shortDescription:
		      type: 'string'
		      maxLength: SHORT_DESCRIPTION_MAX_LENGTH
		    href:
		      type: 'string'
		      maxLength: HREF_MAX_LENGTH
```


