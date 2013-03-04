var psyiC5sid = "5t26xMLIT91Z";
// safe-standard@gecko.js

var psyiC5iso;
try {
	psyiC5iso = (opener != null) && (typeof(opener.name) != "unknown") && (opener.psyiC5wid != null);
} catch(e) {
	psyiC5iso = false;
}
if (psyiC5iso) {
	window.psyiC5wid = opener.psyiC5wid + 1;
	psyiC5sid = psyiC5sid + "_" + window.psyiC5wid;
} else {
	window.psyiC5wid = 1;
}
function psyiC5n() {
	return (new Date()).getTime();
}
var psyiC5s = psyiC5n();
function psyiC5st(f, t) {
	if ((psyiC5n() - psyiC5s) < 7200000) {
		return setTimeout(f, t * 1000);
	} else {
		return null;
	}
}
var psyiC5ol = true;
function psyiC5ow() {
	if (psyiC5ol || (1 == 1)) {
		var pswo = "menubar=0,location=0,scrollbars=auto,resizable=1,status=0,width=500,height=460";
		var pswn = "pscw_" + psyiC5n();
		var url = "http://messenger.providesupport.com/messenger/versionone.html?ps_s=" + psyiC5sid;
		if (false && !false) {
			window.open(url, pswn, pswo); 
		} else {
			var w = window.open("", pswn, pswo); 
			try {
				w.document.body.innerHTML += '<form id="pscf" action="http://messenger.providesupport.com/messenger/versionone.html" method="post" target="' + pswn + '" style="display:none"><input type="hidden" name="ps_s" value="'+psyiC5sid+'"></form>';
				w.document.getElementById("pscf").submit();
			} catch (e) {
				w.location.href = url;
			}
		}
	} else if (1 == 2) {
		document.location = "http\u003a\u002f\u002f";
	}
}
var psyiC5il;
var psyiC5it;
function psyiC5pi() {
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
	if ((il != psyiC5il) || (it != psyiC5it)) {
		psyiC5il = il;
		psyiC5it = it;
		var d = document.getElementById('ciyiC5');
		if (d != null) {
			d.style.left  = Math.round(psyiC5il) + "px";
			d.style.top  = Math.round(psyiC5it) + "px";
		}
	}
	setTimeout("psyiC5pi()", 100);
}
var psyiC5lc = 0;
function psyiC5si(t) {
	window.onscroll = psyiC5pi;
	window.onresize = psyiC5pi;
	psyiC5pi();
	psyiC5lc = 0;
	var url = "http://messenger.providesupport.com/" + ((t == 2) ? "auto" : "chat") + "-invitation/versionone.html?ps_s=" + psyiC5sid + "&ps_t=" + psyiC5n() + "";
	var d = document.getElementById('ciyiC5');
	if (d != null) {
		d.innerHTML = '<iframe allowtransparency="true" style="background:transparent;width:271;height:191" src="' + url + 
			'" onload="psyiC5ld()" frameborder="no" width="271" height="191" scrolling="no"></iframe>';
	}
}
function psyiC5ld() {
	if (psyiC5lc == 1) {
		var d = document.getElementById('ciyiC5');
		if (d != null) {
			d.innerHTML = "";
		}
	}
	psyiC5lc++;
}
if (false) {
	psyiC5si(1);
}
var psyiC5d = document.getElementById('scyiC5');
if (psyiC5d != null) {
	if (psyiC5ol || (1 == 1) || (1 == 2)) {
		if (false) {
			psyiC5d.innerHTML = '<table style="display:inline" cellspacing="0" cellpadding="0" border="0"><tr><td align="center"><a href="#" onclick="psyiC5ow(); return false;"><img name="psyiC5image" src="http://image.providesupport.com/image/versionone/online-1781731303.png" width="57" height="169" border="0"></a></td></tr><tr><td align="center"><a href="http://www.providesupport.com/pb/versionone" target="_blank"><img src="http://image.providesupport.com/lcbps.gif" width="140" height="17" border="0"></a></td></tr></table>';
		} else {
			psyiC5d.innerHTML = '<a href="#" onclick="psyiC5ow(); return false;"><img name="psyiC5image" src="http://image.providesupport.com/image/versionone/online-1781731303.png" width="57" height="169" border="0"></a>';
		}
	} else {
		psyiC5d.innerHTML = '';
	}
}
var psyiC5op = false;
function psyiC5co() {
	var w1 = psyiC5ci.width - 1;
	psyiC5ol = (w1 & 1) != 0;
	psyiC5sb(psyiC5ol ? "http://image.providesupport.com/image/versionone/online-1781731303.png" : "http://image.providesupport.com/image/versionone/offline-585379028.png");
	psyiC5scf((w1 & 2) != 0);
	var h = psyiC5ci.height;

	if (h == 1) {
		psyiC5op = false;

	// manual invitation
	} else if ((h == 2) && (!psyiC5op)) {
		psyiC5op = true;
		psyiC5si(1);
		//alert("Chat invitation in standard code");
		
	// auto-invitation
	} else if ((h == 3) && (!psyiC5op)) {
		psyiC5op = true;
		psyiC5si(2);
		//alert("Auto invitation in standard code");
	}
}
var psyiC5ci = new Image();
psyiC5ci.onload = psyiC5co;
var psyiC5pm = true;
var psyiC5cp = psyiC5pm ? 30 : 60;
var psyiC5ct = null;
function psyiC5scf(p) {
	if (psyiC5pm != p) {
		psyiC5pm = p;
		psyiC5cp = psyiC5pm ? 30 : 60;
		if (psyiC5ct != null) {
			clearTimeout(psyiC5ct);
			psyiC5ct = null;
		}
		psyiC5ct = psyiC5st("psyiC5rc()", psyiC5cp);
	}
}
function psyiC5rc() {
	psyiC5ct = psyiC5st("psyiC5rc()", psyiC5cp);
	try {
		psyiC5ci.src = "http://image.providesupport.com/cmd/versionone?" + "ps_t=" + psyiC5n() + "&ps_l=" + escape(document.location) + "&ps_r=" + escape(document.referrer) + "&ps_s=" + psyiC5sid + "" + "";
	} catch(e) {
	}
}
psyiC5rc();
var psyiC5cb = "http://image.providesupport.com/image/versionone/online-1781731303.png";
function psyiC5sb(b) {
	if (psyiC5cb != b) {
		var i = document.images['psyiC5image'];
		if (i != null) {
			i.src = b;
		}
		psyiC5cb = b;
	}
}

