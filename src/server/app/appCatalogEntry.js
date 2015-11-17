// Generated by CoffeeScript 1.10.0
(function() {
  var AppCatalogEntry, DESCRIPTION_MAX_LENGTH, HREF_MAX_LENGTH, HREF_TEXT_MAX_LENGTH, RELNOTES_MAX_LENGTH, SHORT_DESCRIPTION_MAX_LENGTH, _, appCatalogEntrySchema, jayschema, jp, js, jsonSchema, mongoose, t, td, uri, validator;

  mongoose = require('mongoose');

  jayschema = require('jayschema');

  js = new jayschema(jayschema.loaders.http);

  uri = require('uri-js');

  validator = require('validator').Validator;

  jp = require('JSONPath')["eval"];

  _ = require('underscore');

  t = function(type) {
    if (type == null) {
      type = String;
    }
    return {
      type: type
    };
  };

  td = function(type, def) {
    var val;
    if (def == null) {
      def = null;
    }
    val = t(type);
    val["default"] = def;
    return val;
  };

  appCatalogEntrySchema = mongoose.Schema({
    docVersion: td(Number, 1),
    id: t(),
    titleSection: {
      type: {
        name: t(),
        shortDescription: t(),
        pricing: t(),
        support: {
          type: {
            text: t(),
            href: t()
          }
        }
      }
    },
    descriptionSection: {
      type: {
        description: t()
      }
    },
    linksSection: {
      type: [
        {
          type: t(),
          href: t(),
          title: t()
        }
      ]
    },
    updatesSection: {
      type: {
        updates: {
          type: [Object]
        },
        qualityBands: {
          type: Object
        }
      }
    },
    mediaSection: {
      type: [
        {
          mimetype: t(),
          title: t(),
          caption: t(),
          href: t(),
          thumbhref: t()
        }
      ]
    }
  });

  HREF_TEXT_MAX_LENGTH = 100;

  HREF_MAX_LENGTH = 1000;

  SHORT_DESCRIPTION_MAX_LENGTH = 140;

  RELNOTES_MAX_LENGTH = 2000;

  DESCRIPTION_MAX_LENGTH = 4000;

  jsonSchema = {
    title: 'Catalog Entry',
    type: 'object',
    "$schema": 'http://json-schema.org/draft-04/schema#',
    required: ['id', 'titleSection', 'descriptionSection', 'linksSection', 'updatesSection'],
    properties: {
      docVersion: {
        description: 'Document version number',
        type: 'number'
      },
      id: {
        description: 'The unique id for this catalog entry',
        type: 'string',
        maxLength: 100
      },
      titleSection: {
        description: 'The data for the title section',
        type: 'object',
        required: ['name', 'shortDescription', 'pricing', 'support'],
        properties: {
          name: {
            type: 'string',
            maxLength: 100
          },
          shortDescription: {
            type: 'string',
            maxLength: SHORT_DESCRIPTION_MAX_LENGTH
          },
          pricing: {
            type: 'string',
            maxLength: SHORT_DESCRIPTION_MAX_LENGTH
          },
          support: {
            type: 'object',
            required: ['text', 'href'],
            properties: {
              text: {
                type: 'string',
                maxLength: HREF_TEXT_MAX_LENGTH
              },
              href: {
                type: 'string',
                maxLength: HREF_MAX_LENGTH
              }
            }
          }
        }
      },
      descriptionSection: {
        type: 'object',
        required: ['description'],
        properties: {
          description: {
            type: 'string',
            maxLength: DESCRIPTION_MAX_LENGTH
          }
        }
      },
      linksSection: {
        type: 'array',
        items: {
          type: 'object',
          required: ['type', 'title', 'href'],
          properties: {
            'type': {
              type: 'string',
              maxLength: 50
            },
            title: {
              type: 'string',
              maxLength: HREF_TEXT_MAX_LENGTH
            },
            href: {
              type: 'string',
              maxLength: HREF_MAX_LENGTH
            }
          }
        }
      },
      updatesSection: {
        type: 'object',
        required: ['updates', 'qualityBands'],
        properties: {
          updates: {
            type: 'array',
            items: {
              type: 'object',
              required: ['date', 'description', 'version'],
              properties: {
                date: {
                  type: 'string',
                  format: 'date-time',
                  maxLength: 100
                },
                description: {
                  type: 'string',
                  maxLength: DESCRIPTION_MAX_LENGTH
                },
                version: {
                  type: 'string',
                  maxLength: 50
                },
                releaseNotes: {
                  type: 'string',
                  maxLength: RELNOTES_MAX_LENGTH
                },
                moreInfoUrl: {
                  type: 'string',
                  maxLength: HREF_MAX_LENGTH
                },
                qualityBand: {
                  type: 'string',
                  maxLength: 50
                },
                downloadUrl: {
                  type: 'string',
                  maxLength: HREF_MAX_LENGTH
                }
              }
            }
          },
          qualityBands: {
            minProperties: 1,
            patternProperties: {
              "^.*$": {
                type: 'object',
                required: ['shortDescription'],
                properties: {
                  shortDescription: {
                    type: 'string',
                    maxLength: SHORT_DESCRIPTION_MAX_LENGTH
                  },
                  href: {
                    type: 'string',
                    maxLength: HREF_MAX_LENGTH
                  }
                }
              }
            }
          }
        }
      },
      mediaSection: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'caption', 'mimetype', 'href', 'thumbhref'],
          properties: {
            title: {
              type: 'string',
              maxLength: HREF_TEXT_MAX_LENGTH
            },
            caption: {
              type: 'string',
              maxLength: 200
            },
            mimetype: {
              type: 'string',
              maxLength: 100
            },
            href: {
              type: 'string',
              maxLength: HREF_MAX_LENGTH
            },
            thumbhref: {
              type: 'string',
              maxLength: HREF_MAX_LENGTH
            }
          }
        }
      }
    }
  };

  AppCatalogEntry = mongoose.model('AppCatalogEntry', appCatalogEntrySchema);

  validator.prototype.error = function(msg) {
    this._errors.push(msg);
    return this;
  };

  validator.prototype.getErrors = function() {
    return this._errors;
  };

  AppCatalogEntry.validate = function(data, callback) {
    return js.validate(data, jsonSchema, function(errs) {
      var allowableQualityBandsNames, errors, i, j, k, len, len1, len2, path, ref, ref1, rogue, specifiedQualityBandNamesInUpdates, url, urls, va, validatorErrors;
      if (errs) {
        return callback(errs);
      } else {
        errors = [];
        urls = [];
        ref = ['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref'];
        for (i = 0, len = ref.length; i < len; i++) {
          path = ref[i];
          urls.push.apply(urls, jp(data, '$..' + path));
        }
        for (j = 0, len1 = urls.length; j < len1; j++) {
          url = urls[j];
          va = new validator();
          va.check(url).isUrl();
          validatorErrors = va.getErrors();
          if (validatorErrors.length > 0) {
            errors.push({
              href: url,
              errors: validatorErrors
            });
          }
        }
        specifiedQualityBandNamesInUpdates = jp(data, '$..updates..qualityBand');
        allowableQualityBandsNames = _.keys(jp(data, '$..qualityBands')[0]);
        ref1 = _.difference(specifiedQualityBandNamesInUpdates, allowableQualityBandsNames);
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          rogue = ref1[k];
          errors.push('The qualityBand ' + rogue + ' does not exist in the updates/qualityBands section. Available bands are: ' + allowableQualityBandsNames.join(', '));
        }
        if (errors.length > 0) {
          return callback(errors);
        } else {
          return callback(null);
        }
      }
    });
  };

  module.exports = AppCatalogEntry;

}).call(this);
