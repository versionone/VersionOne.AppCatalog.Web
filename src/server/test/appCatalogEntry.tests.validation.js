// Generated by CoffeeScript 1.10.0
(function() {
  var DESCRIPTION_MAX_LENGTH, HREF_MAX_LENGTH, HREF_TEXT_MAX_LENGTH, RELNOTES_MAX_LENGTH, SHORT_DESCRIPTION_MAX_LENGTH, importer, requireCover, should;

  requireCover = require('./requireCover')('app');

  should = require('should');

  importer = requireCover('importer');

  importer(requireCover('testData'));

  importer(require('./appCatalogEntry.test.base'));

  HREF_MAX_LENGTH = 1000;

  HREF_TEXT_MAX_LENGTH = 100;

  SHORT_DESCRIPTION_MAX_LENGTH = 140;

  RELNOTES_MAX_LENGTH = 2000;

  DESCRIPTION_MAX_LENGTH = 4000;

  describe('AppCatalogEntry: overall', function() {
    test('fails for an empty entry', function() {
      var entry;
      return entry = {};
    }, expectPropertiesMissing, {
      '#': ['id', 'titleSection', 'descriptionSection', 'linksSection', 'updatesSection']
    });
    return test('fails when id exceeds maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.id = ex(100);
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/id': 100
    });
  });

  describe('AppCatalogEntry: titleSection', function() {
    test('fails on titleSection empty', function() {
      var entry;
      return entry = titleSectionEmpty();
    }, expectPropertiesMissing, {
      '#/titleSection': ['name', 'shortDescription', 'pricing', 'support']
    });
    test('succeeds on valid titleSection', function() {
      var entry;
      entry = fullyValidEntry();
      return entry;
    }, expectNoErrors);
    test('fails on invalid types for titleSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.titleSection = {
        name: 0,
        shortDescription: 0,
        pricing: 0,
        support: 0
      };
      return entry;
    }, expectTypesInvalid, {
      '#/titleSection/name': 'string',
      '#/titleSection/shortDescription': 'string',
      '#/titleSection/pricing': 'string',
      '#/titleSection/support': 'object'
    });
    test('fails when a titleSection properties exceed maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.titleSection = {
        name: ex(100),
        shortDescription: ex(SHORT_DESCRIPTION_MAX_LENGTH),
        pricing: ex(SHORT_DESCRIPTION_MAX_LENGTH),
        support: {
          text: ex(100),
          href: ex(HREF_MAX_LENGTH)
        }
      };
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/titleSection/name': 100,
      '#/titleSection/shortDescription': SHORT_DESCRIPTION_MAX_LENGTH,
      '#/titleSection/pricing': SHORT_DESCRIPTION_MAX_LENGTH,
      '#/titleSection/support/text': 100,
      '#/titleSection/support/href': HREF_MAX_LENGTH
    });
    test('fails on invalid types for titleSection/support', function() {
      var entry;
      entry = fullyValidEntry();
      entry.titleSection.support = {
        text: 0,
        href: 0
      };
      return entry;
    }, expectTypesInvalid, {
      '#/titleSection/support/text': 'string',
      '#/titleSection/support/href': 'string'
    });
    return test('fails on invalid URI in titleSection/support/href', function() {
      var entry;
      entry = fullyValidEntry();
      entry.titleSection.support.href = 'this is not a url';
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'this is not a url',
        errors: ['Invalid URL']
      }
    });
  });

  describe('AppCatalogEntry: descriptionSection', function() {
    test('fails when descriptionSection missing', function() {
      var entry;
      entry = descriptionSectionMissing();
      return entry;
    }, expectPropertiesMissing, {
      '#': ['descriptionSection']
    });
    test('fails on empty descriptionSection', function() {
      var entry;
      entry = descriptionSectionEmpty();
      return entry;
    }, expectPropertiesMissing, {
      '#/descriptionSection': ['description']
    });
    test('fails on invalid types for descriptionSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.descriptionSection = {
        description: 0
      };
      return entry;
    }, expectTypesInvalid, {
      '#/descriptionSection/description': 'string'
    });
    return test('fails when description exceeds maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.descriptionSection.description = ex(DESCRIPTION_MAX_LENGTH);
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/descriptionSection/description': DESCRIPTION_MAX_LENGTH
    });
  });

  describe('AppCatalogEntry: linksSection', function() {
    test('fails when linksSection missing', function() {
      var entry;
      entry = linksSectionMissing();
      return entry;
    }, expectPropertiesMissing, {
      '#': ['linksSection']
    });
    test('fails when linkSection link missing required properties', function() {
      var entry;
      entry = fullyValidEntry();
      entry.linksSection = [{}];
      return entry;
    }, expectPropertiesMissing, {
      '#/linksSection/0': ['type', 'title', 'href']
    });
    test('fails on invalid types for linksSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.linksSection = [
        {
          type: 0,
          title: 0,
          href: 0
        }
      ];
      return entry;
    }, expectTypesInvalid, {
      '#/linksSection/0/type': 'string',
      '#/linksSection/0/title': 'string',
      '#/linksSection/0/href': 'string'
    });
    test('fails on invalid href in linksSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.linksSection = [
        {
          type: 'this is a type',
          title: 'title text',
          href: 'not a valid URL'
        }
      ];
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'not a valid URL',
        errors: ['Invalid URL']
      }
    });
    return test('fails when linksSection properties exceed maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.linksSection = [
        {
          type: ex(50),
          title: ex(HREF_TEXT_MAX_LENGTH),
          href: ex(HREF_MAX_LENGTH)
        }
      ];
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/linksSection/0/type': 50,
      '#/linksSection/0/title': HREF_TEXT_MAX_LENGTH,
      '#/linksSection/0/href': HREF_MAX_LENGTH
    });
  });

  describe('AppCatalogEntry: updatesSection/updates', function() {
    test('fails when updatesSection missing', function() {
      var entry;
      entry = updatesSectionMissing();
      return entry;
    }, expectPropertiesMissing, {
      '#': ['updatesSection']
    });
    test('fails when updatesSection empty', function() {
      var entry;
      entry = updatesSectionEmpty();
      return entry;
    }, expectPropertiesMissing, {
      '#/updatesSection': ['updates', 'qualityBands']
    });
    test('fails when updatesSection/updates properties exceed maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.updates = [
        {
          date: ex(100),
          description: ex(DESCRIPTION_MAX_LENGTH),
          version: ex(50),
          releaseNotes: ex(RELNOTES_MAX_LENGTH),
          moreInfoUrl: ex(HREF_MAX_LENGTH),
          qualityBand: ex(50),
          downloadUrl: ex(HREF_MAX_LENGTH)
        }
      ];
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/updatesSection/updates/0/date': 100,
      '#/updatesSection/updates/0/description': DESCRIPTION_MAX_LENGTH,
      '#/updatesSection/updates/0/version': 50,
      '#/updatesSection/updates/0/releaseNotes': RELNOTES_MAX_LENGTH,
      '#/updatesSection/updates/0/moreInfoUrl': HREF_MAX_LENGTH,
      '#/updatesSection/updates/0/qualityBand': 50,
      '#/updatesSection/updates/0/downloadUrl': HREF_MAX_LENGTH
    });
    test('fails on invalid types for updatesSection/updates', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.updates = [
        {
          date: 0,
          description: 0,
          version: 0,
          releaseNotes: 0,
          moreInfoUrl: 0,
          qualityBand: 0,
          downloadUrl: 0
        }
      ];
      return entry;
    }, expectTypesInvalid, {
      '#/updatesSection/updates/0/date': 'string',
      '#/updatesSection/updates/0/description': 'string',
      '#/updatesSection/updates/0/version': 'string',
      '#/updatesSection/updates/0/releaseNotes': 'string',
      '#/updatesSection/updates/0/moreInfoUrl': 'string',
      '#/updatesSection/updates/0/qualityBand': 'string',
      '#/updatesSection/updates/0/downloadUrl': 'string'
    });
    test('fails when updatesSection/updates is missing required properties', function() {
      var entry;
      return entry = updatesSectionWithEmptyUpdates();
    }, expectPropertiesMissing, {
      '#/updatesSection/updates/0': ['date', 'description', 'version']
    });
    test('fails on invalid moreInfoUrl in updatesSection/updates', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.updates[0].moreInfoUrl = "not a url";
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'not a url',
        errors: ['Invalid URL']
      }
    });
    return test('fails on invalid downloadUrl in updatesSection/updates', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.updates[0].downloadUrl = "not a url";
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'not a url',
        errors: ['Invalid URL']
      }
    });
  });

  describe('AppCatalogEntry: updatesSection/qualityBands', function() {
    test('fails when qualityBands has fewer than 1 property', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.qualityBands = {};
      return entry;
    }, expectMinPropertiesNotMet, {
      '#/updatesSection/qualityBands': 1
    });
    test('fails when a qualityBand is missing required properties', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling = {};
      return entry;
    }, expectPropertiesMissing, {
      '#/updatesSection/qualityBands/sapling': ['shortDescription']
    });
    test('fails when a qualityBand has invalid types', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling = {
        shortDescription: 0,
        href: 0
      };
      return entry;
    }, expectTypesInvalid, {
      '#/updatesSection/qualityBands/sapling/shortDescription': 'string',
      '#/updatesSection/qualityBands/sapling/href': 'string'
    });
    test('fails when a qualityBand properties exceed maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling = {
        shortDescription: ex(SHORT_DESCRIPTION_MAX_LENGTH),
        href: ex(HREF_MAX_LENGTH)
      };
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/updatesSection/qualityBands/sapling/shortDescription': SHORT_DESCRIPTION_MAX_LENGTH,
      '#/updatesSection/qualityBands/sapling/href': HREF_MAX_LENGTH
    });
    test('fails on invalid href in a qualityBand', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling.href = 'not a url';
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'not a url',
        errors: ['Invalid URL']
      }
    });
    return test('fails when an update refers to a non-existent qualityBand', function() {
      var entry;
      entry = fullyValidEntry();
      entry.updatesSection.updates[0].qualityBand = 'perfect';
      return entry;
    }, expectErrorsEqual, {
      '0': 'The qualityBand perfect does not exist in the updates/qualityBands section. Available bands are: sapling, mature'
    });
  });

  describe('AppCatalogEntry: mediaSection', function() {
    test('fails when a mediaSection item is missing required properties', function() {
      var entry;
      entry = fullyValidEntry();
      entry.mediaSection = [{}];
      return entry;
    }, expectPropertiesMissing, {
      '#/mediaSection/0': ['title', 'caption', 'mimetype', 'href', 'thumbhref']
    });
    test('fails on invalid types for mediaSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.mediaSection = [
        {
          title: 0,
          caption: 0,
          mimetype: 0,
          href: 0,
          thumbhref: 0
        }
      ];
      return entry;
    }, expectTypesInvalid, {
      '#/mediaSection/0/title': 'string',
      '#/mediaSection/0/caption': 'string',
      '#/mediaSection/0/mimetype': 'string',
      '#/mediaSection/0/href': 'string',
      '#/mediaSection/0/thumbhref': 'string'
    });
    test('fails on invalid href or thumbhref in mediaSection', function() {
      var entry;
      entry = fullyValidEntry();
      entry.mediaSection[0].href = 'not a valid href URL';
      entry.mediaSection[0].thumbhref = 'not a valid thumbhref URL';
      return entry;
    }, expectErrorsEqual, {
      '0': {
        href: 'not a valid href URL',
        errors: ['Invalid URL']
      },
      '1': {
        href: 'not a valid thumbhref URL',
        errors: ['Invalid URL']
      }
    });
    return test('fails when mediaSection properties exceed maxLength', function() {
      var entry;
      entry = fullyValidEntry();
      entry.mediaSection = [
        {
          title: ex(HREF_TEXT_MAX_LENGTH),
          caption: ex(200),
          mimetype: ex(100),
          href: ex(HREF_MAX_LENGTH),
          thumbhref: ex(HREF_MAX_LENGTH)
        }
      ];
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/mediaSection/0/title': HREF_TEXT_MAX_LENGTH,
      '#/mediaSection/0/caption': 200,
      '#/mediaSection/0/mimetype': 100,
      '#/mediaSection/0/href': HREF_MAX_LENGTH,
      '#/mediaSection/0/thumbhref': HREF_MAX_LENGTH
    });
  });

}).call(this);
