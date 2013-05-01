Feature: Text Links Section
	As a potential consumer of a VersionOne-related product,
	I want to find the links to external resources
	So that I take actions related to the product.

	Scenario: Navigate Text Links with a recognized type
		Given an application with text link <type>
		When I view the application detail page
		Then I see <title> and <icon>
		And <title> is a link that opens <hyperlink> in a new browser tab
			| title         | type     		| icon               | hyperlink |
			| download      | download 		| download icon      | https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/explore.feature |
			| source        | source   		| source icon 	     | https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/explore.feature |
			| documentation | documentation | documentation icon | https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/explore.feature |
			| license	    | license	    | license icon       | https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/explore.feature |

	Scenario: Navigate Text Links where there are multiple of the same type
		Given an application with 2 text links of type "download"
		When I view the application detail page
		Then I see each title
		And both have the "download icon"

	Scenario: Navigate Text Links with an unrecognized type
		Given an application with text link of type "foo"
		When I view the application detail page
		Then that link has the "hyperlink icon"

	Scenario: No Text Links
		Given an application with no text links
		When I view the application detail page
		Then I do not see any text links