const formElement = document.getElementById('form');
const inputElement = document.getElementById('input');
const infoElement = document.getElementById('info');
const displayElement = document.getElementById('display');
const scoreElement = document.getElementById('score');
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');
const sliderHex = document.getElementById('slider-hex');
const helpText = document.getElementById('help-text');
const tableElement = document.getElementById('table');
const helpCheckbox = document.getElementById('help-checkbox');
const tableCheckbox = document.getElementById('table-checkbox');
const bnoCheckbox = document.getElementById('big-num-only-checkbox');
const hexCheckbox = document.getElementById('hex-checkbox');

var correct = 0;
var tries = 0;

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = inputElement.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function isNumber(e) {
    string = e.key;
    if (typeof string != "string") return false;
    return !isNaN(string) && !isNaN(parseFloat(string));
}

function decToHex(dec) {
    var value = parseInt(dec);
    var hexCode = "";

    while (value > 0) {
        var v = value % 16;

        if (v < 10) {
            hexCode = v + hexCode;
        }
        else {
            hexCode = String.fromCharCode(v + 55) + hexCode;
        }
        value = parseInt(value / 16);
    }
    return hexCode;
}

function hexToDec(hex) {
    return parseInt(hex, 16);
}

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function sliderText() {
    sliderValue.value = `${slider.value}`;
    sliderHex.innerText = `(0x${decToHex(slider.value)})`;
    newEquation();
}
sliderText();
slider.addEventListener("input", sliderText)

sliderValue.addEventListener("focusout", (e) => {
    sliderText();
});

sliderValue.addEventListener("keyup", (e) => {
    let value = sliderValue.value
    if (value < 15) value = 15;
    if (value > 4095) value = 4095;
    slider.value = value;

    sliderHex.innerText = `(0x${decToHex(slider.value)})`
});

function helpCheckboxCheck() {
    if (helpCheckbox.checked)
    {
        helpText.style.display = "block";
    }
    else
    {
        helpText.style.display = "none";
    }
}
helpCheckboxCheck()
helpCheckbox.addEventListener('change', helpCheckboxCheck);

function tableCheckboxCheck() {
    if (tableCheckbox.checked)
    {
        table.style.display = "grid";
    }
    else
    {
        table.style.display = "none";
    }
}
tableCheckboxCheck()
tableCheckbox.addEventListener('change', tableCheckboxCheck);

bnoCheckbox.addEventListener("input", newEquation);
hexCheckbox.addEventListener("input", newEquation);

function reset() {
    infoElement.textContent = "Hexadecimal Tester";
    correct = 0;
    tries = 0;
    scoreElement.textContent = `Score: ${correct}/${tries}`;
    newEquation();
}

function checkAwnser(inputValue) {
    tries = tries+1;

    let displayNum = displayElement.innerText;
    // Hex
    if (displayNum.substring(0, 2) == "0x") {
        displayNum = displayNum.substring(2, displayNum.length);

        if (inputValue.toUpperCase() == hexToDec(displayNum))
        {
            infoElement.innerHTML = '<span style="color:green">Correct</span>';
            correct = correct+1;
        }
        else {
            infoElement.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${hexToDec(displayNum)}`;
            if (inputValue != "") infoElement.innerHTML += ` (not "${inputValue}")`;
        }
    }
    // Dec
    else {
        if (inputValue.toUpperCase() == decToHex(displayNum))
        {
            infoElement.innerHTML = '<span style="color:green">Correct</span>';
            correct = correct+1;
        }
        else {
            infoElement.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${decToHex(displayNum)}`;
            if (inputValue != "") infoElement.innerHTML += ` (not "${inputValue}")`;
        }
    }

    newEquation();
}

function newEquation() {
    input.value = ""

    // Hex to Dec
    if (randNum(0, 2) == 0 || hexCheckbox.checked) {
        let number = decToHex(randNum(0, slider.value));

        // Biggest Number Only
        if (bnoCheckbox.checked) {
            number = String(number);
            let string = number[0];
            for (let i = 0; i < number.length-1; i++) {
                string += "0";
            }
            number = string;
        }

        displayElement.innerText = `0x${number}`;

        // Help
        let list = [];
        let str = String(number).split("").reverse().join("");
        let n = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "0") {
                n += "0";
                continue;
            };
            let splitNum = str[i]+n;
            list.push([splitNum, hexToDec(splitNum)]);
            n += "0";
        }

        helpText.innerHTML = "";
        for (let i = list.length-1; i >= 0; i--)
        {
            helpText.innerHTML += `0x${list[i][0]} = ${list[i][1]}<br>`;
        }
    }
    // Dec to Hex
    else {
        let number = randNum(0, slider.value);

        // Biggest Number Only
        if (bnoCheckbox.checked) {
            number = String(number);
            let string = number[0];
            for (let i = 0; i < number.length-1; i++) {
                string += "0";
            }
            number = string;
        }

        displayElement.innerText = `${number}`;

        // Help
        let list = [];
        let str = String(number).split("").reverse().join("");
        let n = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "0") {
                n += "0";
                continue;
            };
            let splitNum = str[i]+n;
            list.push([splitNum, decToHex(splitNum)]);
            n += "0";
        }

        helpText.innerHTML = "";
        for (let i = list.length-1; i >= 0; i--)
        {
            helpText.innerHTML += `${list[i][0]} = 0x${list[i][1]}<br>`;
        }
        helpText.innerHTML += decToHex(number);
    }
}

reset();
input.focus();