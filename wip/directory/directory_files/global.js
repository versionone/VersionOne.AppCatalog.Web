<!--
// Default text on search input
function clickclear(thisfield, defaulttext) {
  if (thisfield.value == defaulttext) {
	thisfield.value = "";
  }
} 
function clickrecall(thisfield, defaulttext) {
  if (thisfield.value == "") {
   thisfield.value = defaulttext;
  }
}

// Resize Content & save to cookies
function set_cookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function get_cookie(name) {
    var name_eq = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(name_eq) == 0) return c.substring(name_eq.length,c.length);
    }
    return null;
}


if(get_cookie("page_size") != null){
    document.write('<style>');
    document.write('body{');
    document.write('font-size:'+ get_cookie("page_size") + 'px');
    document.write('}');
    document.write('</style>')
} else {
    document.write('<style>');
    document.write('body{');
    document.write('font-size: 11px');
    document.write('}');
    document.write('</style>')
}

/* Emails */
var emailCall = "mailto:";
var host = "@versionone.com";
function info() { document.write("<a href=\""+emailCall+"info"+host+"\" class=\"email-icon\">info"+host+"</a>"); }
function sales() { document.write("<a href=\""+emailCall+"info"+host+"\" class=\"email-icon\">sales"+host+"</a>"); }
function partners() { document.write("<a href=\""+emailCall+"partners"+host+"\" class=\"email-icon\">partners"+host+"</a>"); }
function alliances() { document.write("<a href=\""+emailCall+"alliances"+host+"\" class=\"email-icon\">alliances"+host+"</a>"); }
function customerSupport() { document.write("<a href=\""+emailCall+"customersupport"+host+"\" class=\"email-icon\">customersupport"+host+"</a>"); }
function support() { document.write("<a href=\""+emailCall+"support"+host+"\" class=\"email-icon\">support"+host+"</a>"); }
function careers() { document.write("<a href=\""+emailCall+"careers"+host+"\" class=\"email-icon\">careers"+host+"</a>"); }
function communityEvents() { document.write("<a href=\""+emailCall+"communityevents"+host+"\" class=\"email-icon\">communityevents"+host+"</a>"); }
function services() { document.write("<a href=\""+emailCall+"services"+host+"\" class=\"email-icon\">services"+host+"</a>"); }
function servicesHere() { document.write("<a href=\""+emailCall+"services"+host+"\">click here</a>"); }
function partnerSales() { document.write("<a href=\""+emailCall+"partnersales"+host+"\">PartnerSales@VersionOne.com</a>"); }
function fed() { document.write("<a href=\""+emailCall+"federal"+host+"\" class=\"email-icon\">federal@versionone.com</a>"); }

/* Partner Emails */
function TrailRidge_PeteBehrens() { document.write("<a href=\""+emailCall+"pete@trailridgeconsulting.com\">Pete Behrens</a>"); }
function SalesFeaturePlan() { document.write("<a href=\""+emailCall+"sales@featureplan.com\">sales@featureplan.com</a>"); }
function AutomatedQA() { document.write("<a href=\""+emailCall+"sales@automatedqa.com\">sales@automatedqa.com</a>"); }
function Atlassian() { document.write("<a href=\""+emailCall+"sales@atlassian.com\">sales@atlassian.com</a>"); }
function SolutionsIQ() { document.write("<a href=\""+emailCall+"info@solutionsiq.com\">info@solutionsiq.com</a>"); }
function SligerConsulting() { document.write("<a href=\""+emailCall+"info@sligerconsulting.com\">Michele Sliger</a>"); }
function NetObjects() { document.write("<a href=\""+emailCall+"mike.shalloway@netobjectives.com\">Mike Shalloway</a>"); }
function LitheSpeed() { document.write("<a href=\""+emailCall+"sanjiv.augustine@lithespeed.com\">Sanjiv Augustine</a>"); }
function Innovel() { document.write("<a href=\""+emailCall+"sanjiv.rdymond@innovel.net\">Robin Dymond</a>"); }
function DevJam() { document.write("<a href=\""+emailCall+"david.hussman@devjam.com\">David Hussman</a>"); }
function CCPace() { document.write("<a href=\""+emailCall+"ranton@ccpace.com\">Rose Anton</a>"); }
function ASPE() { document.write("<a href=\""+emailCall+"dmantica@aspeinc.com\">David Mantica, President</a>"); }
function ThreeBack() { document.write("<a href=\""+emailCall+"mary.anderson@3back.com\">Mary Anderson</a>"); }
/* end Partner Emails */
/* end Emails */


/* Custom Link Tracking vars added 09/30/2011 by Ed Hill */
s.linkTrackVars="prop1,prop2,events"
s.linkTrackEvents="event1"
/* End Link Tracking vars */

-->