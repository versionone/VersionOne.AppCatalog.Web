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

Feature: Media Links

	Scenario: One media item
		Given an application with only one media item
		When I view the application detail page
		Then the carousel navigator is not visible
		And previous/next buttons are not visible

	Scenario: Multiple media items
		Given an application with 3 media items
		When I view the application detail page
		Then the carousel navigator shows 3 items
		And the carousel selector is on the first item
		And the first media item is displayed
		And previous/next buttons are visible

	Scenario: Roll from last to first
		Given an application with 3 media items
		And the third media item is displayed
		When I click the next button
		Then the carousel selector moves to the first item
		And the first media item is displayed

	Scenario: Roll from first to last
		Given an application with 3 media items
		And the first media item is displayed
		When I click the previous button
		Then the carousel selector moves to the third item
		And the third media item is displayed

	Scenario: Play a video item
		Given an application with a video media item
		When I start the video
		And I navigate to another media item
		Then the video pauses
		And the sound stops

	Scenario: Restart paused video
		Given a paused video
		When I restart the video
		Then the video starts from the paused location

	Scenario: Media Label/Caption
		When I view a media item
		Then the media label is displayed

	Scenario: Explore All Releases
