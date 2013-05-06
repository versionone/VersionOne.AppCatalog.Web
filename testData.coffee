data =
  fullyValidEntry: ->
    entry = {
      id : 'someIdHere',
      titleSection: @titleSectionComplete(),
      descriptionSection: @descriptionSectionComplete(),
      linksSection: @linksSectionComplete(),
      updatesSection: @updatesSectionComplete(),
      mediaSection: @mediaSectionComplete()
    }
    return entry

  titleSectionMissing: ->
    entry = @fullyValidEntry()
    delete entry.titleSection
    return entry

  titleSectionEmpty: ->
    entry = @fullyValidEntry()
    entry.titleSection = {}
    return entry

  titleSectionComplete: ->
    return {
      name: 'String Name',
      shortDescription: 'Free short description',
      pricing: 'Free',
      support: {
        text: 'Text label'
        href: 'http://somesite.com'
      }
    }

  descriptionSectionMissing: ->
    entry = @fullyValidEntry()
    delete entry.descriptionSection
    return entry

  descriptionSectionEmpty: ->
    entry = @fullyValidEntry()
    entry.descriptionSection = {}
    return entry

  descriptionSectionComplete: ->
    return {
      description: 'This is a valid description for an entry'
    }

  linksSectionMissing: ->
    entry = @fullyValidEntry()    
    delete entry.linksSection
    return entry

  linksSectionEmpty: ->
    entry = @fullyValidEntry()    
    entry.linksSection = {}
    return entry

  linksSectionComplete: ->
    return [{
      "type" : "download",
      "href" : "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip",
      "title" : "Download Latest Stable Release"
    }, {
      "type" : "download",
      "href" : "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip",
      "title" : "Download Latest Nightly Build"
    }, {
      "type" : "code",
      "href" : "https://github.com/versionone/V1ClarityPPM",
      "title" : "Source Code"
    }, {
      "type" : "documentation",
      "href" : "https://github.com/versionone/V1ClarityPPM/blob/master/README.md",
      "title" : "Documentation"
    }, {
      "type" : "license",
      "href" : "https://github.com/versionone/V1ClarityPPM/blob/master/LICENSE.md",
      "title" : "Modified BSD (3-clause) License"
    }, {
      "type" : "foo",
      "href" : "https://github.com/versionone/V1ClarityPPM/blob/master",
      "title" : "Sample configuration"
    }]

  updatesSectionMissing: ->
    entry = @fullyValidEntry()
    delete entry.updatesSection
    return entry

  updatesSectionEmpty: ->
    entry = @fullyValidEntry()
    entry.updatesSection = {}
    return entry 

  updatesSectionWithEmptyUpdates: ->
    entry = @fullyValidEntry()
    entry.updatesSection.updates = [{}]
    entry

  updatesSectionComplete: ->
    return {
      updates: [
          date: "2013-02-14T17:45:00Z"
          description: "stabilizing timesheet workflow"
          version: "0.3.2.13"
          releaseNotes: "Florum gypsum dimsum"
          moreInfoUrl: "http://example.com"
          qualityBand: "mature"
          downloadUrl: "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip"
        ,
          date: "2013-02-14T17:45:00Z"
          description: "better timesheet support"
          version: "0.3.3.5"
          releaseNotes: "Florum gypsum dimsum"
          moreInfoUrl: "http://more.exampleForYou.com"
          qualityBand: "sapling"
          downloadUrl: "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.2.1.10.zip"
        ]
        qualityBands:
          sapling:
            name: "sapling"
            shortDescription: "The product is undergoing rapid growth. The code works but expect major changes."
            href: "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#sapling"
          mature:
            name: "mature"
            shortDescription: "The product is stable. The code will continue to evolve with minimum breaking changes."
            href: "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#mature"
    }

  mediaSectionComplete: ->
    return [{
        "title": "Home",
        "caption": "The home image",
        "mediatype": "image/png",
        "href": "http://absolute.content.com/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg",
        "thumbhref": "https://absolute.content.com/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg"
    }]

module.exports = data