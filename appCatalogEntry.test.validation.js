// Generated by CoffeeScript 1.6.2
(function() {
  var HREF_MAX_LENGTH, HREF_TEXT_MAX_LENGTH, SHORT_DESCRIPTION_MAX_LENGTH, importer, should;

  should = require('should');

  importer = require('./importer');

  importer(require('./testData'));

  importer(require('./appCatalogEntry.test.base'));

  HREF_MAX_LENGTH = 1000;

  HREF_TEXT_MAX_LENGTH = 100;

  SHORT_DESCRIPTION_MAX_LENGTH = 140;

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
        pricing: ex(50),
        support: {
          text: ex(100),
          href: ex(1000)
        }
      };
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/titleSection/name': 100,
      '#/titleSection/shortDescription': SHORT_DESCRIPTION_MAX_LENGTH,
      '#/titleSection/pricing': 50,
      '#/titleSection/support/text': 100,
      '#/titleSection/support/href': 1000
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
      entry.descriptionSection.description = ex(2000);
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/descriptionSection/description': 2000
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
          description: ex(1000),
          version: ex(50),
          releaseNotes: ex(1000),
          moreInfoUrl: ex(HREF_MAX_LENGTH),
          qualityBand: ex(50),
          downloadUrl: ex(HREF_MAX_LENGTH)
        }
      ];
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/updatesSection/updates/0/date': 100,
      '#/updatesSection/updates/0/description': 1000,
      '#/updatesSection/updates/0/version': 50,
      '#/updatesSection/updates/0/releaseNotes': 1000,
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
      '#/updatesSection/qualityBands/sapling': ['name', 'shortDescription', 'href']
    });
    test('fails when a qualityBand has invalid types', function() {
      var entry;

      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling = {
        name: 0,
        shortDescription: 0,
        href: 0
      };
      return entry;
    }, expectTypesInvalid, {
      '#/updatesSection/qualityBands/sapling/name': 'string',
      '#/updatesSection/qualityBands/sapling/shortDescription': 'string',
      '#/updatesSection/qualityBands/sapling/href': 'string'
    });
    test('fails when a qualityBand properties exceed maxLength', function() {
      var entry;

      entry = fullyValidEntry();
      entry.updatesSection.qualityBands.sapling = {
        name: ex(100),
        shortDescription: ex(SHORT_DESCRIPTION_MAX_LENGTH),
        href: ex(HREF_MAX_LENGTH)
      };
      return entry;
    }, expectMaxLengthsExceeded, {
      '#/updatesSection/qualityBands/sapling/name': 100,
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

}).call(this);
