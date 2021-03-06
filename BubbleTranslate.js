/*
 Copyright (C) 2010  Federico Trodler
 Copyright (C) 2012  Nuno Santos
 This software is licensed under the GNU GPL version 2.0.
 For more information read the LICENSE file or visit 
 http://creativecommons.org/licenses/GPL/2.0/
*/
var c = "jlhlebbhengjlhmcjebbkambaekglhkf",
    d = [],
    f = [];

chrome.extension.sendRequest({
    a: "getConf"
});

function i() {
    var b = document.getElementsByClassName(c);
    if (b[0]) for (; b[0];) {
        var a = b.length - 1;
        b[a].parentNode.removeChild(b[a])
    }
}
document.addEventListener("mouseup", function (b) {
    console.log('mouseup');
    if (b.target.parentNode.className != c && b.target.parentNode.id != c + "_cont") {
    //if (window.getSelection() && b.target.parentNode.className != c &&
    //    b.target.parentNode.id != c + "_cont") {

        i();
        chrome.extension.sendRequest({
            a: "Selection",
            text: "" + window.getSelection()
        });
        for (var a = 0; a < d.length / 5; a++) window.getSelection().type == "Range" && b.shiftKey == d[a + 4 * a + 1] && b.ctrlKey == d[a + 4 * a + 2] && b.metaKey == d[a + 4 * a + 3] && b.altKey == d[a + 4 * a + 4] && chrome.extension.sendRequest({
            a: "Translate",
            text: "" + window.getSelection(),
            lang: "" + d[a + 4 * a]
        })
    }
}, false);
 
chrome.extension.onRequest.addListener(function (b) {
    switch (b.a) {
    case "Conf":
        d = b.d;
        f = b.b;
        var a = document.createElement("style");
        b = document.createTextNode("." + c + " {top: 0px; left: 0px;min-width: 30px;max-width: 300px;font-size: " + f[3] + ";font-family: " + f[2] + ";opacity: " + (f[4] < 10 ? ".0" + f[4] : f[4] > 99 ? "1" : "." + f[4]) + ";padding:0px;position:absolute;display:block;z-index: 999997;font-style: normal;font-variant: normal;font-weight: normal;}#" + c + "_up{text-align: center;padding:0px;margin: 0px;}#" + c + "_cont{background-color: " + f[0] + ";font-family: " + f[2] + "-webkit-box-shadow: " + f[0] + " 0px 0px 2px;color: " + f[1] + ";padding:7px;-webkit-border-radius: 5px;}#" + c + "_down{text-align: center;padding:0px;margin: 0px;}");
        a.type = "text/css";
        a.appendChild(b);
        document.getElementsByTagName("head")[0].appendChild(a);
        break;
    case "Result":
        a = b.text;
        var e = b.c;
        i();
        if (!(window.getSelection().rangeCount <= 0)) {
            b = document.createElement("div");
            b.setAttribute("class", c);
            b.innerHTML = "<div id='" + c + "_up'><canvas id='" + c + "_arrow_up' width='14' height='8' style='vertical-align: bottom;'></canvas></div><div id='" + c + "_cont' style='direction:" + e + ";'>" + a + "</div><div id='" + c + "_down'><canvas id='" + c + "_arrow_down' width='14' height='8' style='vertical-align: top;'></canvas></div>";
            document.body.appendChild(b);
            a = [];
            a[0] = "0";
            a[1] = "0";
            a[2] = "300";
            a[3] = "down";
            a[4] = "center";
            a[5] = "0";
            var h = window.getSelection().getRangeAt(0).getBoundingClientRect();
            b = h.top + document.body.scrollTop;
            e = h.left + document.body.scrollLeft;
            var g = h.width;
            h = h.height;
            if (g > 100) document.getElementsByClassName(c)[0].style.maxWidth = g + "px";
            a[0] = b - document.getElementsByClassName(c)[0].offsetHeight;
            a[1] = e - document.getElementsByClassName(c)[0].offsetWidth / 2 + g / 2;
            if (a[0] - document.body.scrollTop < 1) {
                a[0] = b + h;
                a[3] = "up"
            }
            if (a[1] - document.body.scrollLeft < 1) {
                a[1] = e;
                a[4] = "left";
                a[5] = "8"
            }
            if (a[1] + document.getElementsByClassName(c)[0].offsetWidth > document.body.clientWidth) {
                a[1] = document.body.clientWidth - document.getElementsByClassName(c)[0].offsetWidth;
                a[4] = "right";
                a[5] = "8"
            }
            b = document.getElementsByClassName(c)[0];
            e = document.getElementById(c + "_up");
            g = document.getElementById(c + "_down");
            b.style.top = a[0] + "px";
            b.style.left = a[1] + "px";
            e.style.textAlign = a[4];
            g.style.textAlign = a[4];
            e.style.paddingLeft = a[5] + "px";
            g.style.paddingLeft = a[5] + "px";
            e.style.paddingRight = a[5] + "px";
            g.style.paddingRight = a[5] + "px";
            b = document.getElementById(c + "_arrow_" + a[3]).getContext("2d");
            b.fillStyle = f[0];
            b.globalAlpha = 1;
            b.shadowColor = f[0];
            b.shadowOffsetX = 0;
            b.shadowOffsetY = 0;
            b.shadowBlur = 2;
            b.beginPath();
            if (a[3] == "down") {
                b.moveTo(0, 0);
                b.lineTo(14, 0);
                b.lineTo(7, 8)
            } else {
                b.moveTo(0, 8);
                b.lineTo(14, 8);
                b.lineTo(7, 0)
            }
            b.fill()
        }
        break
    }
});
