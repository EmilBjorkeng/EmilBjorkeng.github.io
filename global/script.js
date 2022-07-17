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

var exporationDate = new Date();
exporationDate.setDate(exporationDate.getDate() + 30); // Expires after 30 days
exporationDate = exporationDate.toUTCString();
var en = document.getElementsByClassName("en")
var nb = document.getElementsByClassName("nb")

// Cookies
let cookieLang = getCookie("lang");
if (!cookieLang) {
    document.cookie = "lang=en; path=/; expires=" + exporationDate;
    cookieLang = "en"
}

// English
if (!getCookie("lang") || getCookie("lang") == "en") {
    for (let i = 0; i < nb.length; i++)
        nb[i].style.display = "none";
}
// Norwegian
else if (getCookie("lang") == "nb") {
    for (let i = 0; i < en.length; i++)
        en[i].style.display = "none";
}

// Language Switch Function
function langSwitch(lang) {
    // Norwegian
    if (lang == "nb") {
        document.cookie = "lang=nb; path=/; expires=" + exporationDate;

        for (let i = 0; i < nb.length; i++)
            nb[i].style.display = en[i].style.display;
        for (let i = 0; i < en.length; i++)
            en[i].style.display = "none";
    }
    // English
    else if (lang == "en") {
        document.cookie = "lang=en; path=/; expires=" + exporationDate;

        for (let i = 0; i < en.length; i++)
            en[i].style.display = nb[i].style.display;
        for (let i = 0; i < nb.length; i++)
            nb[i].style.display = "none";
    }
}