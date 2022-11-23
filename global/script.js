// Remove scrollbar from menu padding
var scrollbarSize = window.innerWidth - document.body.clientWidth;
if (scrollbarSize) {
    let menu = document.getElementsByClassName("menu");
    let rightPadding = getComputedStyle(menu[0]).getPropertyValue('padding-right')
    menu[0].style.paddingRight = `${parseFloat(rightPadding) - scrollbarSize}px`
}