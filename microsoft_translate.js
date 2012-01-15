var MicrosoftTranslate = {

	getLanguages: function(callback) {

		var codes;

		window.languageNamesCallback = function(languageNames) {
			var ret = {};
			for(c in codes) {
				ret[codes[c]] = languageNames[c];
				codes[c] = languageNames[c];
			}
			
			callback(ret);
		}

		window.languageCodesCallback = function(languageCodes) {

			var codesStr = "[";
			for (c in languageCodes) {
				codesStr += "\"" + languageCodes[c] + "\",";
			}
			codesStr += "]"

			codes = languageCodes;

            var s2 = document.createElement("script");
	        s2.src = "http://api.microsofttranslator.com/V2/Ajax.svc/" +
	        	"GetLanguageNames?oncomplete=languageNamesCallback&" +
	        	"appId=" + microsoftAppId + "&locale=en&languageCodes=" +
	        	codesStr;
	        document.getElementsByTagName("head")[0].appendChild(s2);
        }

		var s = document.createElement("script");
        s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/" +
        	"GetLanguagesForTranslate?oncomplete=languageCodesCallback&" +
        	"appId=" + microsoftAppId;
        document.getElementsByTagName("head")[0].appendChild(s);
	},

	// TODO: Error handling
	detectLanguage: function(sampleText, callback) {
		window.detectCallback = callback;

		var detectScript = document.createElement("script");
	    detectScript.src = "http://api.microsofttranslator.com/V2/Ajax.svc/" +
	    	"Detect?oncomplete=detectCallback&appId=" + microsoftAppId +
	    	"&text=" + encodeURIComponent(sampleText);
    	document.getElementsByTagName('head')[0].appendChild(detectScript);
	},

	// TODO: Error handling
	translate: function(from, to, text, callback) {
		window.translateCallback = callback;

        var s = document.createElement("script");
        s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/" +
        	"Translate?oncomplete=translateCallback&appId=" + microsoftAppId +
        	"&from=" + from + "&to=" + to + "&text=" + encodeURIComponent(text);
        document.getElementsByTagName("head")[0].appendChild(s);
	}

}