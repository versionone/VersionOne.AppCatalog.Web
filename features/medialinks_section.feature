Feature: Media Links
	As a potential consumer of a VersionOne application,
	I want to find pictures and videos about an application
	So that I can make an emotional decision about whether that application will suit my needs.

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
