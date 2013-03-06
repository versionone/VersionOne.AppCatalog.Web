Feature: Add or Update an Application in the Catalog
	As a developer building an application extending or integrating with VersionOne,
	I want to easily publish updates about my application
	So that VersionOne customers can easily find attractive and compelling information about my application.

	The instructions for creating an application entry contain a human readable schema defining required fields.

	Scenario: Make an update with required fields
		When I make a catalog update with required fields:
			| staticId    |
			| name        |
			| description |
			| cost        |
			| support     |
			| updates     |
		Then my update succeeds.

	Scenario: Make an update where there are optional fields
		When I make a catalog update with textLinks
		Then my update succeeds.

	Scenario: Make an update where one or more required fields are missing
		When I make a catalog update without staticId
		Then my update fails.

	Scenario: Make an update where there is an undefined attribute name
		When I make a catalog update with an attribute fooBar
		Then my update fails.
		