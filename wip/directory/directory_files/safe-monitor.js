var ps7oKcsid = "5t26xMLIT91Z";
// safe-monitor@gecko.js

var ps7oKciso;
try {
	ps7oKciso = (opener != null) && (typeof(opener.name) != "unknown") && (opener.ps7oKcwid != null);
} catch(e) {
	ps7oKciso = false;
}
if (ps7oKciso) {
	window.ps7oKcwid = opener.ps7oKcwid + 1;
	ps7oKcsid = ps7oKcsid + "_" + window.ps7oKcwid;
} else {
	window.ps7oKcwid = 1;
}
function ps7oKcn() {
	return (new Date()).getTime();
}
var ps7oKcs = ps7oKcn();
function ps7oKcst(f, t) {
	if ((ps7oKcn() - ps7oKcs) < 7200000) {
		return setTimeout(f, t * 1000);
	} else {
		return null;
	}
}
var ps7oKcil;
var ps7oKcit;
function ps7oKcpi() {
	var il;
	if (3 == 2) {
		il = window.pageXOffset + 50;
	} else if (3 == 3) {
		il = (window.innerWidth * 50 / 100) + window.pageXOffset;
	} else {
		il = 50;
	}
	il -= (271 / 2);
	var it;
	if (3 == 2) {
		it = window.pageYOffset + 50;
	} else if (3 == 3) {
		it = (window.innerHeight * 50 / 100) + window.pageYOffset;
	} else {
		it = 50;
	}
	it -= (191 / 2);
	if ((il != ps7oKcil) || (it != ps7oKcit)) {
		ps7oKcil = il;
		ps7oKcit = it;
		var d = document.getElementById('ci7oKc');
		if (d != null) {
			d.style.left  = Math.round(ps7oKcil) + "px";
			d.style.top  = Math.round(ps7oKcit) + "px";
		}
	}
	setTimeout("ps7oKcpi()", 100);
}
var ps7oKclc = 0;
function ps7oKcsi(t) {
	window.onscroll = ps7oKcpi;
	window.onresize = ps7oKcpi;
	ps7oKcpi();
	ps7oKclc = 0;
	var url = "http://messenger.providesupport.com/" + ((t == 2) ? "auto" : "chat") + "-invitation/versionone.html?ps_s=" + ps7oKcsid + "&ps_t=" + ps7oKcn() + "";
	var d = document.getElementById('ci7oKc');
	if (d != null) {
		d.innerHTML = '<iframe allowtransparency="true" style="background:transparent;width:271;height:191" src="' + url + 
			'" onload="ps7oKcld()" frameborder="no" width="271" height="191" scrolling="no"></iframe>';
	}
}
function ps7oKcld() {
	if (ps7oKclc == 1) {
		var d = document.getElementById('ci7oKc');
		if (d != null) {
			d.innerHTML = "";
		}
	}
	ps7oKclc++;
}
if (false) {
	ps7oKcsi(1);
}
var ps7oKcop = false;
function ps7oKcco() {
	var w1 = ps7oKcci.width - 1;
	ps7oKcscf((w1 & 2) != 0);
	var h = ps7oKcci.height;

	if (h == 1) {
		ps7oKcop = false;

	// manual invitation
	} else if ((h == 2) && (!ps7oKcop)) {
		ps7oKcop = true;
		ps7oKcsi(1);

	// auto invitation
	} else if ((h == 3) && (!ps7oKcop)) {
		ps7oKcop = true;
		ps7oKcsi(2);
	}
}
var ps7oKcci = new Image();
ps7oKcci.onload = ps7oKcco;
var ps7oKcpm = true;
var ps7oKccp = ps7oKcpm ? 30 : 60;
var ps7oKcct = null;
function ps7oKcscf(p) {
	if (ps7oKcpm != p) {
		ps7oKcpm = p;
		ps7oKccp = ps7oKcpm ? 30 : 60;
		if (ps7oKcct != null) {
			clearTimeout(ps7oKcct);
			ps7oKcct = null;
		}
		ps7oKcct = ps7oKcst("ps7oKcrc()", ps7oKccp);
	}
}
function ps7oKcrc() {
	ps7oKcct = ps7oKcst("ps7oKcrc()", ps7oKccp);
	try {
		ps7oKcci.src = "http://image.providesupport.com/cmd/versionone?" + "ps_t=" + ps7oKcn() + "&ps_l=" + escape(document.location) + "&ps_r=" + escape(document.referrer) + "&ps_s=" + ps7oKcsid + "" + "";
	} catch(e) {
	}
}
ps7oKcrc();


