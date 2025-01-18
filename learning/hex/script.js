var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');
var sliderHex = document.getElementById('slider-hex');
var help = document.getElementById('help');
var helpCheckbox = document.getElementById('help-checkbox');
var table = document.getElementById('table');
var tableCheckbox = document.getElementById('table-checkbox');
var bnoCheckbox = document.getElementById('big-num-only-checkbox');
var hexCheckbox = document.getElementById('hex-checkbox');

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

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

function reset() {
    respons.textContent = "Hexadecimal Tester";
}

function sliderText() {
    sliderValue.value = `${slider.value}`;
    sliderHex.innerText = `(0x${decToHex(slider.value)})`;
    newNumber();
}
sliderText();
slider.addEventListener("input", sliderText)

function helpCheckboxCheck() {
    if (helpCheckbox.checked)
    {
        help.style.display = "inherit";
    }
    else
    {
        help.style.display = "none";
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

bnoCheckbox.addEventListener("input", newNumber);
hexCheckbox.addEventListener("input", newNumber);

sliderValue.addEventListener("keyup", (e) => {
    let value = sliderValue.value
    if (value < 15) value = 15;
    if (value > 4095) value = 4095;
    slider.value = value;

    sliderHex.innerText = `(0x${decToHex(slider.value)})`
});

sliderValue.addEventListener("focusout", (e) => {
    sliderText();
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = input.value.toLowerCase();
    checkAwnser(inputValue);
});

function checkAwnser(inputValue) {
    let displayNum = displayElement.innerText;
    // Hex
    if (displayNum.substring(0, 2) == "0x") {
        displayNum = displayNum.substring(2, displayNum.length);

        if (inputValue.toUpperCase() == hexToDec(displayNum))
        {
            respons.innerHTML = '<span style="color:green">Correct</span>';
        }
        else {
            respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${hexToDec(displayNum)}`;
            if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;
        }
    }
    // Dec
    else {
        if (inputValue.toUpperCase() == decToHex(displayNum))
        {
            respons.innerHTML = '<span style="color:green">Correct</span>';
        }
        else {
            respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${decToHex(displayNum)}`;
            if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;
        }
    }
    newNumber();
}

function newNumber() {
    input.value = "";

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

        help.innerHTML = "";
        for (let i = list.length-1; i >= 0; i--)
        {
            help.innerHTML += `0x${list[i][0]} = ${list[i][1]}<br>`;
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

        help.innerHTML = "";
        for (let i = list.length-1; i >= 0; i--)
        {
            help.innerHTML += `${list[i][0]} = 0x${list[i][1]}<br>`;
        }
        help.innerHTML += decToHex(number);
    }
}

reset();
input.focus();