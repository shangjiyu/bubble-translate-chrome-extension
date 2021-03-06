/*
 Copyright (C) 2010  Federico Trodler
 Copyright (C) 2012  Nuno Santos
 This software is licensed under the GNU GPL version 2.0.
 For more information read the LICENSE file or visit 
 http://creativecommons.org/licenses/GPL/2.0/
*/

google.load("language", "1");
google.setOnLoadCallback(initGoogleAjax);

var j = [],
    k = [],
    m = [];

var availableLanguages;

function initGoogleAjax() {
    var source = document.getElementById("source");
    source.addEventListener("keyup", p, false);
    source.addEventListener("paste", p, false);
    p();
}

function changeLanguage() {
    
}

function n(a) {
    switch (a) {
    case "1":
        a = document.getElementById("mainLang").value;
        j[2] = j[0];
        j[0] = a;
        k[0] = a;
        localStorage.lang = JSON.stringify(j);
        localStorage.shortcut = JSON.stringify(k);
        chrome.extension.sendRequest({
            a: "Reload"
        });
        chrome.extension.sendRequest({
            a: "popTranslate"
        });
        break;
    case "2":
        chrome.tabs.create({
            url: "preferences.html"
        });
        break;
    case "3":
        chrome.extension.sendRequest({
            a: "popTranslate"
        });
        console.log('popTranslate');
        break;
    case "4":
        chrome.extension.sendRequest({
            a: "webTranslate"
        });
        console.log('webTranslate');
        break;
    case "5":
        document.getElementById("menu").style.display = "none";
        document.getElementById("real").style.display = "block";
        break;
    case "6":
        j[1] = document.getElementById("realLang").value;
        localStorage.lang = JSON.stringify(j);
        chrome.extension.sendRequest({
            a: "Reload"
        });
        p();
        break
    }
}

function p() {
    var a = document.getElementById("source").value.replace(/[\n]+/g, "<br>"),
        c = document.getElementById("srcLang").value,
        g = document.getElementById("srcLang"),
        h = document.getElementById("realLang").value,
        f = document.getElementById("results_body");

    if (a != "") {
        a = "http://translate.google.com/translate_a/t?client=f&otf=1&pc=0&sl=" + c + "&text=" + encodeURIComponent(a).replace(/%3Cbr%3E/gi, "%0A") + "&hl=" + j[0] + "&tl=" + h;
        chrome.extension.sendRequest({
            a: "Real",
            url: a
        }, function (d) {
            var l = "";
            for (var e in d.sentences) l += d.sentences[e].trans;
            e = "";
            if (d.dict) for (var i in d.dict) {
                e += "<b>" + d.dict[i].pos + ": </b> ";
                e += "<i>" + unescape(d.dict[i].terms.slice(0, 5).join(", ")) + ".</i><br />"
            }
            if (d.src == "ar" || d.src == "iw") document.getElementById("source").style.direction = "rtl";
            else document.getElementById("source").style.direction = "ltr";
            f.style.direction = h == "ar" || h == "iw" ? "rtl" : "ltr";
            if (c == "auto") for (i = 0; i < g.length; i++) if (g[i].value == d.src) g[0].text = "Auto-" + g[i].text;
            f.innerText = l;
            dict_body.innerHTML = e
        })
    } else {
        g[0].text = "Auto detect";
        f.innerHTML = ""
    }
}

function q(a) {
    for (var c = 0; c < mainLang.length; c++) if (mainLang[c].value == a) return mainLang[c].text
}
function r(a, c, g, h) {
    var f = document.createElement("option");
    f.text = c;
    f.value = g;
    f.disabled = h;
    a.add(f, a[0]);
    a[0].selected = true
}

function initPopup() {
    console.log('initPopup()');
    document.getElementById("mainLang").addEventListener("change", function () {
        n("1")
    }, false);
    document.getElementById("pref").addEventListener("click", function () {
        n("2")
    }, false);
    document.getElementsByClassName("button")[0].addEventListener("click", function () {
        n("3")
    }, false);
    document.getElementsByClassName("button")[1].addEventListener("click", function () {
        n("4")
    }, false);
    document.getElementsByClassName("button")[2].addEventListener("click", function () {
        n("5")
    }, false);
    document.getElementById("swap").addEventListener("click", function () {
        var d = document.getElementById("realLang"),
            l = document.getElementById("srcLang"),
            e = document.getElementById("realLang").value,
            i = document.getElementById("srcLang").value;
        if (l[0].text.split("-")[1] != undefined) {
            for (var o = 0; o < l.length; o++) if (l[o].value == e) l[o].selected = true;
            for (e = 0; e < d.length; e++) if (i == "auto") {
                if (d[e].text == l[0].text.split("-")[1]) d[e].selected = true
            } else if (d[e].value == i) d[e].selected = true
        }
        p()
    }, false);
    document.getElementsByClassName("opt_select")[2].addEventListener("change", function () {
        n("6")
    }, false);
    document.getElementsByClassName("opt_button")[0].addEventListener("click", function () {
        p()
    }, false);
    j = JSON.parse(localStorage.lang);
    k = JSON.parse(localStorage.shortcut);
    m = JSON.parse(localStorage.iconClick);
    if (m[2] == true) n("5");
    else if (m[3] == true) {
        n("3");
        window.close()
    }
    var a = chrome.extension.getURL("images/controls.png");
    document.getElementById("pref").style.background = "url(" + a + ") no-repeat 0px 0px";
    document.getElementById("swap").style.background = "url(" + a + ") no-repeat -16px 0px";
    a = document.getElementById("mainLang");
    var c = document.getElementById("realLang"),
        g = document.getElementById("srcLang"),
        h = "";

    for (var f in availableLanguages) {
        if (availableLanguages[f] != "") {
            h += '<option value="' + f + '">' +
            availableLanguages[f] + "</option>";
        }
    }
    a.innerHTML = h;
    c.innerHTML = h;
    g.innerHTML = h;
    r(a, "-", "separator", true);
    r(c, "-", "separator", true);
    r(g, "-", "separator", true);
    if (j[2] != j[0] && j[2] != j[1]) {
        r(a, q(j[2]), j[2], false);
        r(c, q(j[2]), j[2], false)
    }
    if (j[1] != j[0]) {
        r(a, q(j[1]), j[1], false);
        r(c, q(j[0]), j[0], false)
    }
    r(c, q(j[1]), j[1], false);
    r(g, "Auto detect", "auto", false);
    r(a, q(j[0]), j[0], false)
}

window.onload = function() {
    availableLanguages = JSON.parse(localStorage.availableLanguages);
    initPopup();
}
