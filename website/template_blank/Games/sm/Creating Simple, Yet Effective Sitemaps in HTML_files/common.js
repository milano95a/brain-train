var getBrowser = function() {
	var userAgent = navigator.userAgent.toLowerCase();
	if (/webkit/.test( userAgent )) {
		return "safari";
	}
	if (/opera/.test( userAgent )) {
		return "opera";
	}
	if (/msie/.test( userAgent ) && !/opera/.test( userAgent )) {
		return "msie";
	}
	if (/mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )) {
		return "mozilla";
	}
};

var getBrowserVersion = function() {
	var userAgent = navigator.userAgent.toLowerCase();
	return (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];
};

var hasClass = function(element, className) {
	if ((className == "") || (className == null)) return false;
	if ((element == null) || (element == "")) return false;
	var array = (element.className || element).toString().split(/\s+/);
	
	var j=-1;
	for (var i=0;i<array.length;i++) {
		if (array[i] === className) {
			j=i;
		}
	}
	return (j > -1);
}

var removeClass = function(element, className) {
        if ((className == "") || (className == null)) return false;
        if ((element == null) || (element == "")) return false;
	var arr = (element.className || element).toString().split(/\s+/);
	
	var newArr = new Array();
	var j = 0;
	for (var i=0;i<arr.length;i++) {
		if (arr[i] != className) {
			newArr[j] = arr[i];
			j++;
		}
	}
	element.className = newArr.join(" ");
}

var addClass = function(element, className) {
        if ((className == "") || (className == null)) return false;
        if ((element == null) || (element == "")) return false;
	if (!hasClass(element,className)) {
		element.className += (element.className ? " " : "") + className;
	}
}

var searchChilds = function(element, childClassName, level, maxLevel) {
	maxLevel = maxLevel || 0;
	level = level || 0;
	
	var childs = new Array();
	for(var i=0;i<element.childNodes.length;i++) {
		if (hasClass(element.childNodes[i],childClassName)) {
			childs.push(element.childNodes[i]);
		}
		if (element.childNodes[i].childNodes.length > 0 && (maxLevel == 0 || level < maxLevel)) {
			childs = childs.concat(searchChilds(element.childNodes[i],childClassName,level+1,maxLevel));
		}
	}
	return childs;
}

var searchChildsByTagName = function(element, childTagName, level, maxLevel) {
	maxLevel = maxLevel || 0;
	level = level || 0;
	
	var childs = new Array();
	for(var i=0;i<element.childNodes.length;i++) {
		if (element.childNodes[i].tagName == childTagName) {
			childs.push(element.childNodes[i]);
		}
		if (element.childNodes[i].childNodes.length > 0 && (maxLevel == 0 || level < maxLevel)) {
			childs = childs.concat(searchChildsByTagName(element.childNodes[i],childTagName,level+1,maxLevel));
		}
	}
	return childs;
}

function getStyleValue(elem, prop) {
	var ret, style = elem.style;
	
	if (prop == "opacity" && getBrowser() == "msie") {
		return style.filter && style.filter.indexOf("opacity=") >= 0 ?
			(parseFloat( style.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
			"";
	} else {
		return parseInt(style[prop],10) || 0;
	}
}

function setStyleValue(elem, prop, value) {	
	if (prop == "opacity" && getBrowser() == "msie") {
		elem.style.zoom=1;
		elem.style.filter = (elem.style.filter || "").replace( /alpha\([^)]*\)/, "" ) +
			(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
		
	} else {
		elem.style[prop]=value;
	}
}

function getWidth(elem, p, b, m) {
	w = elem.offsetWidth;
	
	p = p || true;
	b = b || true;
	m = m || false;
	
	padding = 0;
	border = 0;
	margin = 0;
	
	if (p)
		padding = getStyleValue(elem, "paddingLeft") + getStyleValue(elem, "paddingRight");
		
	if (b)
		border = getStyleValue(elem, "borderLeftWidth") + getStyleValue(elem, "borderRightWidth");
		
	if (m) 
		margin = getStyleValue(elem, "marginLeft") + getStyleValue(elem, "marginRight");
		
	return w + padding + border + margin;
}

function now() {
	return +new Date;
}

var Animation = function(duration,step,complete,cancel) {
	var startTime = now();
	var dur = duration;
	var self=this;
	
	var timerId = window.setInterval(function() {
		var n  = now() - startTime;
		var state = n / dur;
		if (state > 1) {
			state = 1;
		}
		if (step != undefined && typeof(step) == "function") {
			
			var r = step.call(self,state,n,dur) || true;
			if (!r || state >= 1) {
				window.clearInterval(timerId);
				if (!r && cancel != undefined && typeof(cancel) == "function") {
					cancel.call(state);
				}
				if (r && complete != undefined && typeof(complete) == "function") {
					complete.call(state);
				}
			}
		}
	},13);
	
}


function flashWindow() {
    try {
		if(window.external.msIsSiteMode != undefined){
			if (window.external.msIsSiteMode()) {
				window.setTimeout("window.external.msSiteModeActivate()", 2000);
			}
		}
    }
    catch (ex) {
        // Fail silently.
    }
}

function clickNlsignup()
{	
	document.getElementById('newsletter-signup').style.display ='inline';
}

function doNLSubmitHTML5() {
	//$("div.nl_hide").hide();
	$("#nl_error").hide();
	var email = $("#nl_email").val();
	if (validate(email)) {
		$("#nl_error").show();
	} else {
		$("div.nl_hide").hide();
		var nl_uri   = $("#nl_uri").val();
		var NewsletterKey = $("#navNewsletterSignup").val();
		var businessUnit = $("#businessUnit").val();    
		var NewsletterSignup = $("#NewsletterSignup").val(); 
		var RegistrationWebsite = $("#RegistrationWebsite").val(); 
		$.ajax({
	                type:"POST",
	                url:"/nlsub",
	                data:{email: email, uri: nl_uri, NewsletterKey:NewsletterKey,RegistrationWebsite:RegistrationWebsite,businessUnit:businessUnit,NewsletterSignup:NewsletterSignup},
	                dataType:"json",
	                async: false,
	                success:function(data) {
				if (data.result == "success") {
					$("div.nl_message").html(data.message).show();
				} else {
					//$("#invalid_email_img").show();
					$("div.nl_message").html(data.message).show();
				}
			}
	        });
	}
}
function doNLSubmit() {
	//$("div.nl_hide").hide();
	$("#nl_error").hide();
	var email = $("#nl_email").val();
	if (validate(email)) {
		$("#nl_error").show();
	} else {
		$("div.nl_hide").hide();
		var nl_uri   = $("#nl_uri").val();
		var NewsletterKey = $("#navNewsletterSignup").val();
		var businessUnit = $("#businessUnit").val();    
		var NewsletterSignup = $("#NewsletterSignup").val(); 
		var RegistrationWebsite = $("#RegistrationWebsite").val(); 
		$.ajax({
	                type:"POST",
	                url:"/nlsub",
	                data:{email: email, uri: nl_uri, NewsletterKey:NewsletterKey,RegistrationWebsite:RegistrationWebsite,businessUnit:businessUnit,NewsletterSignup:NewsletterSignup},
	                dataType:"json",
	                async: false,
	                success:function(data) {
				if (data.result == "success") {
					$("div.nl_message").html(data.message).show();
				} else {
					//$("#invalid_email_img").show();
					$("div.nl_message").html(data.message).show();
				}
			}
	        });
	}
}
function validate(email) {
	var reg = /^([A-Za-z0-9_\-\.]{2,})+\@([A-Za-z0-9_\-\.]{2,})+\.([A-Za-z]{2,4})$/;
	if(reg.test(email) == false) return true; else return false;
}

function readCookie( name) 
{
    
var nameEQ = name + "=";
        var ca = document.cookie.split( ';');
        for( var i=0;i < ca.length;i++) 
        {
                var c = ca[i];
                while ( c.charAt( 0)==' ') c = c.substring( 1,c.length);
                if ( c.indexOf( nameEQ) == 0) return c.substring( nameEQ.length,c.length);
        }
        return null;
}

function welcomeUser(){
	var firstName = readCookie('fn');
	var lastName = readCookie('ln');
	
	if(firstName!=null && lastName!=null){
		firstName = decodeURIComponent(firstName);
		lastName =  decodeURIComponent(lastName);
		firstName = firstName.replace("+"," ");
		lastName = lastName.replace("+"," ");						
		$("#header-bar div:nth-child(2) a").html(firstName+" "+lastName);
		$("#header-bar div:nth-child(2) a").attr("href","/accountManagement?formType=userProfile");
		$("#header-bar div:nth-child(2) a").attr("style","font-size:20px;color:white;text-decoration:none;");		
		$("#header-bar div:nth-child(3) a").html("Logout");
		$("#header-bar div:nth-child(3) a").attr("href","/accountManagement?logout=true&formType=logoutForm");		
		$("#header-bar div:nth-child(3) a").attr("style","font-size:20px;color:white;text-decoration:none;");
		$("#header-bar div:nth-child(4) ").attr("style","padding-left:40px;float:left;");
	}
}
var userId = '';
if(readCookie('USERID_COOKIE')!=null){
				userId =  decodeURIComponent(readCookie('USERID_COOKIE'));
}
else if(readCookie('STAGE_USERID_COOKIE')!=null && userId==''){
				userId =  decodeURIComponent(readCookie('STAGE_USERID_COOKIE'));                  
}
else if(readCookie('TEST_USERID_COOKIE')!=null && userId==''){
				userId =  decodeURIComponent(readCookie('TEST_USERID_COOKIE'));                      
}
else if(readCookie('DEV_USERID_COOKIE')!=null && userId==''){
				userId =  decodeURIComponent(readCookie('DEV_USERID_COOKIE'));                       
}
else
				userId = 'undefined';

if(userId!='undefined'){
				var meta = document.createElement('meta');
				meta.name = 'DCS.dcsaut';                          
				meta.content = userId;
				document.getElementsByTagName('head')[0].appendChild(meta);        
}
		
function updateIFrame( leadformData) { //only used for ACL screens not for lead forms pages
		//console.log('leadformData height'+leadformData['height']);
		var iframe = document.getElementById( 'myframe' );   
		var containerDiv = document.getElementById('ACL_Form_Container');
		if(typeof( leadformData['height'] )!=undefined && leadformData['height'] !=0)			 
			iframe.setAttribute( 'height', leadformData['height']);
		
		welcomeUser();						 
	}
    function init() {
  // quit if this function has already been called
  if (arguments.callee.done) return;

  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;

  // kill the timer
  if (_timer) clearInterval(_timer);

  // do stuff
};

/* for Mozilla/Opera9 */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      init(); // call the onload handler
    }
  };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      init(); // call the onload handler
    }
  }, 10);
}

$(function() {
	$("#footerlinks a:last").after(' | <a target="_blank" href="/sitemap.html">Sitemap</a>');
});
/* for other browsers */
window.onload = welcomeUser;

/*!
 * jQuery Cookie Plugin
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

function registrationPopup() {
    if($.cookie('USERID_COOKIE')!=null && $.cookie('newuserregistration')=='y') {
        $("#newuserregistrationpopup").lightbox_me({
            centered: true,
            preventScroll: true,
            overlayCSS: {background: '#595959','opacity': 0.8},
            onClose: function   () {
                $.cookie("newuserregistration", 'n', { path: '/',domain:'.htmlgoodies.com'});
            }
        });
        setTimeout(function(){
            $("#newuserregistrationpopup").trigger("close");
            window.location.href = '/';
        }, 30000);
    }
}

$(document).ready(function(){
    $("img").each(function() {
           var img = $(this);
           if (!img.attr("alt"))
               img.attr("alt", "");
    });
});