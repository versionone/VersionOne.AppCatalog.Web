Feature: Description Section
	As a potential consumer of a VersionOne-related product,
	I want to read a detailed description
	So that I can make an informed decision whether to take any of the actions provided as links.

	Scenario: Read Description Section for a Free Integration from VersionOne
		Given a catalog entry for <app>
		When I read the description section
		Then I see <description>
			| app               | description | 
			| example.shortdesc | a short description |
			| example.longdesc  | Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. |
