/*var title = document.getElementsByClassName("banner")[0].childNodes[7];
var text = title.textContent;
title.textContent = "";

var speed = 90;
let i = 0;
function typeWriter() {
    if (i < text.length) {
        title.textContent += text[i];
        i++;
        setTimeout(typeWriter, speed);
    }
}
typeWriter()

<script type="text/javascript", src="script.js" defer></script>
<a onclick="window.scroll({top:innerHeight, left:0, behavior:'smooth'})" class="arrow"></a>*/

var en = document.getElementsByClassName("en")
var nb = document.getElementsByClassName("nb")
var lang_switch = document.getElementsByClassName("lang-switch")[0]

let exporationDate = new Date(); 
exporationDate.setDate(exporationDate.getDate() + 30); // Expires after 30 days
exporationDate = exporationDate.toUTCString();

// Language Switch Function
function langSwitch() {
    var isActive = lang_switch.classList[1] != "active-switch";

    // Norwegian
    if (isActive) {
        lang_switch.classList.add("active-switch");
        document.cookie = "lang=nb; path=/; expires=" + exporationDate;

        for (let i = 0; i < nb.length; i++)
            nb[i].style.display = en[i].style.display;
        for (let i = 0; i < en.length; i++)
            en[i].style.display = "none";
    }
    // English
    else {
        lang_switch.classList.remove("active-switch");
        document.cookie = "lang=en; path=/; expires=" + exporationDate;

        for (let i = 0; i < en.length; i++)
            en[i].style.display = nb[i].style.display;
        for (let i = 0; i < nb.length; i++)
            nb[i].style.display = "none";
    }
}

// Get Cookies
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

// Cookies
if (!getCookie("lang") || getCookie("lang") == "en") {
    document.cookie = "lang=en; path=/; expires=" + exporationDate;
    for (let i = 0; i < nb.length; i++)
        nb[i].style.display = "none";
}
else if (getCookie("lang") == "nb") {
    lang_switch.classList.add("active-switch");
    for (let i = 0; i < en.length; i++)
        en[i].style.display = "none";
}