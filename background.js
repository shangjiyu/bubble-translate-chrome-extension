/*
 Copyright (C) 2010  Federico Trodler
 Copyright (C) 2012  Nuno Santos
 This software is licensed under the GNU GPL version 2.0.
 For more information read the LICENSE file or visit 
 http://creativecommons.org/licenses/GPL/2.0/
*/

google.load("language", "1");
var c = [],
    d = [],
    f = [],
    g = [],
    h = [];

function j() {
    if (localStorage.lang) {
        c = JSON.parse(localStorage.lang);
        d = JSON.parse(localStorage.shortcut);
        f = JSON.parse(localStorage.iconClick);
        g = JSON.parse(localStorage.theme);
        chrome.tabs.getAllInWindow(null, function (a) {
            for (var b = 0; b < a.length; b++) {
                chrome.tabs.sendRequest(a[b].id, {
                    a: "Conf",
                    d: d,
                    b: g
                });
                if (f[0] == true) chrome.pageAction.hide(a[b].id);
                else {
                    chrome.pageAction.show(a[b].id);
                    chrome.pageAction.setIcon({
                        path: g[5],
                        tabId: a[b].id
                    })
                }
            }
        });
        if (localStorage.version == null || localStorage.version != "1.5") chrome.tabs.create({
            url: "preferences.html"
        })
    } else {
        c[0] = localStorage.lg && localStorage.lg != "" ? localStorage.lg : "en";
        c[1] = "es";
        c[2] = "es";
        d[0] = localStorage.lg && localStorage.lg != "" ? localStorage.lg : "en";
        d[1] = localStorage.sk && localStorage.sk != "" ? JSON.parse(localStorage.sk) : false;
        d[2] = localStorage.ck && localStorage.ck != "" ? JSON.parse(localStorage.ck) : true;
        d[3] = false;
        d[4] = localStorage.ak && localStorage.ak != "" ? JSON.parse(localStorage.ak) : false;
        f[0] = false;
        f[1] = true;
        f[2] = false;
        f[3] = false;
        g[0] = localStorage.cc && localStorage.cc != "" ? localStorage.cc : "#729FCF";
        g[1] = localStorage.ct && localStorage.ct != "" ? localStorage.ct : "#FFFFFF";
        g[2] = "arial, helvetica, sans-serif";
        g[3] = "13px";
        g[4] = "93";
        g[5] = "images/16.png";
        localStorage.clear();
        localStorage.lang = JSON.stringify(c);
        localStorage.shortcut = JSON.stringify(d);
        localStorage.iconClick = JSON.stringify(f);
        localStorage.theme = JSON.stringify(g);
        chrome.tabs.create({
            url: "preferences.html"
        })
    }
}

function k(a, b, e) {
    console.log('lol');

    var translateCallback = function(translation) {
        if (translation) chrome.tabs.sendRequest(e, {
            a: "Result",
            text: "" + translation,
            c: b == "ar" || b == "iw" ? "rtl" : "ltr"
        })        
    }

    var detectCallback = function(language) {
        if (language && a != "") {
            MicrosoftTranslate.translate(language, c[0], a, translateCallback)
        }
    }

    MicrosoftTranslate.detectLanguage(a, detectCallback);
}

function m(a, b) {
    if (a.length > 2075) a = a.replace(/&text=.+&hl/, "&text=Text%20too%20long&hl");
    var e = new XMLHttpRequest;
    e.onreadystatechange = function () {
        e.readyState == 4 && b(JSON.parse(e.responseText))
    };
    a = a;
    e.open("GET", a, true);
    e.send()
}

chrome.extension.onRequest.addListener(function (a, b, e) {

    console.log('onRequest');

    if (b.tab != null) if (f[0] == true) chrome.pageAction.hide(b.tab.id);
    else {
        chrome.pageAction.show(b.tab.id);
        chrome.pageAction.setIcon({
            path: g[5],
            tabId: b.tab.id
        })
    }
    switch (a.a) {
    case "getConf":
        chrome.tabs.sendRequest(b.tab.id, {
            a: "Conf",
            d: d,
            b: g
        });
        break;
    case "Translate":
        console.log("Translate received");
        k(a.text, a.lang, b.tab.id);
        break;
    case "Selection":
        h[0] = a.text;
        h[1] = b.tab.id;
        break;
    case "popTranslate":
        console.log('popTranslate received');
        h[0] && h[0] != "" && k(h[0], c[0], h[1]);
        break;
    case "webTranslate":
        chrome.tabs.getSelected(null, function (i) {
            chrome.tabs.executeScript(i.id, {
                code: "var e=document.createElement('script');e.type='text/javascript';e.innerText='function googleTranslateElementInit() {new google.translate.TranslateElement({});}';document.body.appendChild(e);var a=document.createElement('script');a.type='text/javascript';a.charset='UTF-8';a.src='http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';document.body.appendChild(a);"
            })
        });
        break;
    case "Real":
        m(a.url, e);
        break;
    case "Reload":
        j();
        break
    }
});
window.onload = function () {
    j();
};