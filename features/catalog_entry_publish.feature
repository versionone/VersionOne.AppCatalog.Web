Feature: Catalog Entry Publish 
  As an author of a VersionOne application or resource
	I want to publish a Catalog Entry about my work
	So that it gets listed in the VersionOne App Catalog and others can find it and download it

	Scenario: Publish Catalog Entry with values for Title Section
		When publishing a given <entry>
    Then I expect <response>

    List: [ 
      {
      "entry": {
        "titleSection": {
          "name": "Example1",
          "pricing": "Free",
          "support": {
            "text": "VersionOne Support",
            "href": "http://support.versionone.com/home"
          },
          "shortDescription": "a quick summary"
        },
        "response": {
          "status": "200",
          "message": "Catalog Entry publish succeeded"
        }

# Reference:
| example.simple        | Example1 | Free    | VersionOne Support | http://support.versionone.com/home | a quick summary |
      }
			| app                   | name     | pricing | support            | hyperlink | short desc | 
			| example.simple        | Example1 | Free    | VersionOne Support | http://support.versionone.com/home | http://support.versionone.com/homea quick summary |
			| example.longshortdesc | Example2 | Free    | VersionOne Support | http://support.versionone.com/home | Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. |

