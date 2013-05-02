mongoose = require 'mongoose'
jayschema = require 'jayschema'
js = new jayschema jayschema.loaders.http
uri = require 'uri-js'
validator = require('validator').Validator
jp = require('JSONPath').eval
_ = require 'underscore'

t = (type) ->
  type = String if not type?
  return { type: type }

td = (type, def) ->
  def = null if not def?
  val = t(type)
  val.default = def
  return val

# Note: consider https://github.com/topliceanu/mongoose-gen to get more sophisticated here

appCatalogEntrySchema = mongoose.Schema(
  docVersion: td(Number, 1)
  id: t()
  titleSection:
    type:
      name: t()
      shortDescription: t()
      pricing: t()
      support: 
        type:
          text: t()
          href: t()
  descriptionSection:
    type:
      description: t()
  linksSection:
    type: [
      type: t()
      href: t()
      title: t()
    ]
  updatesSection:
    type:
      updates:
        type: [
          Object
        ]
      qualityBands:
        type: Object
)

HREF_TEXT_MAX_LENGTH = 100
HREF_MAX_LENGTH = 1000
SHORT_DESCRIPTION_MAX_LENGTH = 140

jsonSchema =
  title: 'Catalog Entry'
  type: 'object'
  "$schema": 'http://json-schema.org/draft-04/schema#'
  required: ['id', 'titleSection', 'descriptionSection', 'linksSection', 'updatesSection']
  properties:
    docVersion:
      description: 'Document version number'
      type: 'number'
    id:
      description: 'The unique id for this catalog entry'
      type: 'string'
      maxLength: 100      
    titleSection:
      description: 'The data for the title section'
      type: 'object'
      required: ['name', 'shortDescription', 'pricing', 'support']
      properties:
        name:
          type: 'string'
          maxLength: 100
        shortDescription:
          type: 'string'
          maxLength: SHORT_DESCRIPTION_MAX_LENGTH
        pricing:
          type: 'string'
          maxLength: 50
        support:
          type: 'object'
          required: ['text', 'href']
          properties:
            text: 
              type: 'string'
              maxLength: HREF_TEXT_MAX_LENGTH
            href: 
              type: 'string'
              maxLength: HREF_MAX_LENGTH
    descriptionSection:
      type: 'object'
      required: ['description']
      properties:
        description: 
          type: 'string'
          maxLength: 2000
    linksSection:
      type: 'array'
      items:
        type: 'object'
        required: ['type', 'title', 'href']
        properties:
          'type':
            type: 'string'
            maxLength: 50
          title:
            type: 'string'
            maxLength: HREF_TEXT_MAX_LENGTH
          href:
            type: 'string'
            maxLength: HREF_MAX_LENGTH
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

AppCatalogEntry = mongoose.model 'AppCatalogEntry', appCatalogEntrySchema

validator::error = (msg) ->
    @_errors.push(msg)
    return @

validator::getErrors = () ->
    return @_errors;

AppCatalogEntry.validate = (data, callback) ->
  js.validate data, jsonSchema, (errs) ->
    if errs
      callback(errs)
    else
      # Validate URL types        
      errors = []
      urls = []
      for path in ['href', 'downloadUrl', 'moreInfoUrl']
        urls.push jp(data, '$..' + path)...
      for url in urls
        va = new validator()
        va.check(url).isUrl()
        validatorErrors = va.getErrors()
        if validatorErrors.length > 0
          errors.push
            href: url
            errors: validatorErrors
      
      # Ensure no update refers to any nonexistent qualityBand
      specifiedQualityBandNamesInUpdates = jp(data, '$..updates..qualityBand')
      allowableQualityBandsNames = jp(data, '$..qualityBands..name')
      for rogue in _.difference(specifiedQualityBandNamesInUpdates, allowableQualityBandsNames)
        errors.push 'The qualityBand ' + rogue + ' does not exist in the updates/qualityBands section. Available bands are: ' + 
          allowableQualityBandsNames.join(', ')

      # return errors or empty
      if errors.length > 0
        callback errors
      else
        callback null

module.exports = AppCatalogEntry