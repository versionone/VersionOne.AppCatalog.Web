Feature: Add or Update an Application in the Catalog
	// TODO: Update is confusing.
	// TODO: These expectations are no different than unit tests. At this time, publishing requires someone to write JSON. Therefore, it seems better to construct actual JSON examples. Alternatively, specify the rules in the schema, as long as that is readable.
	As a developer building an application extending or integrating with VersionOne,
	I want to easily publish updates about my application
	So that VersionOne customers can easily find attractive and compelling information about my application.

	The instructions for creating an application entry contain a human readable schema defining required items.

	Scenario: Publish title section with required items
		When I publish to the catalog with required items:
			| name        |
			| shortDesc   |
			| description |
			| cost        |
			| support     |
		Then my publish succeeds.

	Scenario: Make an publish with a short description that is shorter than 140 characters
		When I publish a shortDesc
			"a quick summary"
		Then my publish succeeds.

	Scenario: Make an publish with a short description that is longer than 140 characters
		When I publish a shortDesc
			"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."
		Then my publish fails.

	Scenario: Make an update with required items
		When I make a catalog update with required items:
			| staticId    |
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
		
	Scenario: Make an update where the quality band has an undefined value
		Given quality bands of "mature", "sapling", and "seed"
		When I make a catalog update with a quality band of "branch"
		Then my update fails.