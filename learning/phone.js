var outsideWrapper = document.getElementsByClassName('outside-wrapper');
var contentWrapper = document.getElementsByClassName('content-wrapper');
var respons = document.getElementById('respons');
var input = document.getElementById('input');

var potens = document.getElementById('potens');
var sliderValueWrapper = document.getElementsByClassName('slider-value-wrapper')[0];
var indicator = document.getElementById('indicator');

if (/Android|iPhone/i.test(navigator.userAgent)) {
    for (let i = 0; i < outsideWrapper.length; i++) {
        let elem = outsideWrapper[i];
        elem.classList.add('phone-outside-wrapper');
    }
    for (let i = 0; i < contentWrapper.length; i++) {
        let elem = contentWrapper[i];
        elem.classList.add('phone-content-wrapper');
    }
    respons.classList.add('phone-respons');

    // Kvadratsettning
    try {
        input.style.width = '70%';
        potens.style.marginLeft = '0';
    } catch (e) {};

    // Hex
    try {
        sliderValueWrapper.style.width = '200%';
    } catch (e) {};

    // Binary
    try {
        indicator.style.bottom = 'inherit';
        indicator.style.translate = '0 -1em';
    } catch (e) {};

    // Triginometri
    try {
        let br = document.getElementsByTagName('br');
        br[2].style.display = 'none';
    } catch (e) {};
}