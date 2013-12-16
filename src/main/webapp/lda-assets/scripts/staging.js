// If the document isn't at a location matching urlPattern then rewrite all a href links 
// which do match urlPattern to point to the same server as this document
// Assumes jQuery
$(function() {
	var hostPattern = /^https?:\/\/([^\/]*)/;
	var schemePattern = /(^https?:\/\/).*/;
	var url = document.URL;
	var requestHost = url.match(hostPattern)[1];
    var requestScheme = url.match(schemePattern)[1];
	
	$("a[href]").each ( function (a) {
		 var replacement = /.*[?&=#].*/.test(this.href) ? encodeURIComponent(this.href) : encodeURI(this.href);
		 var targetHost = this.href.match(hostPattern)[1];
		 //Rewrite off page references.
		 if( targetHost != requestHost &&
			 targetHost != "elda.googlecode.com" &&
			 targetHost != "code.google.com" &&
			 targetHost != "www.axialis.com" ) {
			 this.href = this.href.replace(this.href, requestScheme+requestHost+"/about?resource="+replacement);
		 }
	});
});