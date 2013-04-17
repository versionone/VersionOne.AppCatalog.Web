Feature: Title Section
	As a potential consumer of a VersionOne application,
	I want to 
	So that I can make a quick decision whether to learn more about that application.

	Scenario: Read Title Section for a Free Integration from VersionOne
		Given a catalog entry for <app>
		When I read the title section
		Then I see <name>, <short desc>, <support>, and <pricing>
		And <support> is a link that opens <hyperlink> in a new browser tab
			| app                   | name     | pricing | support            | hyperlink | short desc | 
			| example.simple        | Example1 | Free    | VersionOne Support | http://support.versionone.com/home | a quick summary |
			| example.longshortdesc | Example2 | Free    | VersionOne Support | http://support.versionone.com/home | Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. |

