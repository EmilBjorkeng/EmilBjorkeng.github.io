// Get cookies function
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

// Find date in 30 days (for cookies)
var exporationDate = new Date();
exporationDate.setDate(exporationDate.getDate() + 30); // Expires after 30 days
exporationDate = exporationDate.toUTCString();

// Get elements from document
var en_elements = document.getElementsByClassName("en")
var nb_elements = document.getElementsByClassName("nb")

// Set the language cookie if its not found
let cookieLang = getCookie("lang");
if (!cookieLang) {
    document.cookie = "lang=nb; path=/; expires=" + exporationDate;
    cookieLang = "nb"
}

// Set site to English
if (!getCookie("lang") || getCookie("lang") == "en") {
    for (let i = 0; i < nb_elements.length; i++)
        nb_elements[i].style.display = "none";
}
// Set site to Norwegian
else if (getCookie("lang") == "nb") {
    for (let i = 0; i < en_elements.length; i++)
        en_elements[i].style.display = "none";
}

// Language switch function
function langSwitch(lang) {
    // Norwegian
    if (lang == "nb") {
        document.cookie = "lang=nb; path=/; expires=" + exporationDate;

        for (let i = 0; i < en_elements.length; i++)
            en_elements[i].style.display = "none";
        for (let i = 0; i < nb_elements.length; i++)
            nb_elements[i].style.display = "";
    }
    // English
    else if (lang == "en") {
        document.cookie = "lang=en; path=/; expires=" + exporationDate;

        for (let i = 0; i < nb_elements.length; i++)
            nb_elements[i].style.display = "none";
        for (let i = 0; i < en_elements.length; i++)
            en_elements[i].style.display = "";
    }
}

// Remove scrollbar from menu padding
var scrollbarSize = window.innerWidth - document.body.clientWidth;
if (scrollbarSize) {
    let menu = document.getElementsByClassName("menu");
    let rightPadding = getComputedStyle(menu[0]).getPropertyValue('padding-right')
    menu[0].style.paddingRight = `${parseFloat(rightPadding) - scrollbarSize}px`
}