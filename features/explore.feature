Feature: Explore an Application Detail Page from the Catalog
	As a potential consumer of a VersionOne application,
	I want to learn about an available VersionOne application in an attractive presentation
	So that I can make an informed decision about whether that application will suit my needs.

	Text link behavior is identical for all text link scenarios. Clicking a text link opens the hyperlink in a new browser tab.

	Background:
		Given the "Example" application detail page

	Scenario: Read Application Detail Page
		When I read the page
		Then I see the URL with <app id> in the query part
		And I see <name> and <short desc> in the title area
		And I see <support>, <cost>, and <long desc> in the details area
		And <support> is a link that opens <hyperlink> in a new browser tab
			| app id | name    | short desc | long desc | cost | support            | hyperlink |
			| myUrl  | Example | an example | an example| Free | VersionOne Support | http://support.versionone.com/home |

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

	Scenario: Release section is collapsed by default
		When I view the application detail page
		Then I do not see any details for releases

	Scenario: Expand Release section
		Given an update with 7 releases
		When I expand the all release section
		Then I see 7 release slugs

	Scenario: Hide optional attributes when not provided
		Given an update record without <optional> attribute
		When I view the list of releases
		Then <indicator> element is not displayed
			| optional     | indicator          |
			| Version      | text field         |
			| Download     | button             |
			| Quality Band | label and pop-over |

