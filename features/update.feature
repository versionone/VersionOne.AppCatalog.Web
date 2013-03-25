Feature: Add or Update an Application in the Catalog
	// TODO: Update is confusing.
	As a developer building an application extending or integrating with VersionOne,
	I want to easily publish updates about my application
	So that VersionOne customers can easily find attractive and compelling information about my application.

	The instructions for creating an application entry contain a human readable schema defining required items.

	Scenario: Make an update with required items
		When I make a catalog update with required items:
			| staticId    |
			| name        |
			| description |
			| cost        |
			| support     |
			| updates     |
			| visualLinks |
		Then my update succeeds.

	Scenario: Make an update where there are optional items
		When I make a catalog update with textLinks
		Then my update succeeds.

	Scenario: Make an update with a recognized text link
		When I make a catalog update that is typed as "download", "documentation", "source", and "license"
		Then my update succeeds.

	Scenario: Make an update with an unrecognized text link
		When I make a catalog update that is typed as "foo"
		Then my update succeeds.

	Scenario: Make an update with duplicate text link types
		When I make a catalog update where 2 text links are typed as "foo"
		Then my update succeeds.

	Scenario: Make an update where one or more required items are missing
		When I make a catalog update without staticId
		Then my update fails.

	Scenario: Make an update where there is an undefined attribute name
		When I make a catalog update with an attribute fooBar
		Then my update fails.
		