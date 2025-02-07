var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');
var indicator = document.getElementById('indicator');
var paddingCheckbox = document.getElementById('padding-checkbox');

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function decToBinary(num) {
    return (num >>> 0).toString(2);
}

function binaryToDec(binary) {
    return parseInt(binary, 2);
}

function reset() {
    respons.textContent = "Binary Tester"
}

function sliderText() {
    sliderValue.innerText = `${slider.value} [${Math.pow(2, slider.value)}]`;
    newNumber();
}
sliderText();
slider.addEventListener("input", sliderText)

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = input.value.toLowerCase();
    checkAwnser(inputValue);
});

function checkAwnser(inputValue) {
    inputValue = parseInt(inputValue); // Remove leading 0
    let displayNum = displayElement.innerText;
    // Binary
    if (indicator.innerText == "B")
    {
        if (inputValue == binaryToDec(displayNum))
        {
            respons.innerHTML = '<span style="color:green">Correct</span>';
        }
        else {
            respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${binaryToDec(displayNum)}`;
            if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;
        }
    }
    // Decimal
    else
    {
        if (inputValue == decToBinary(displayNum))
        {
            respons.innerHTML = '<span style="color:green">Correct</span>';
        }
        else {
            respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${decToBinary(displayNum)}`;
            if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;
        }
    }
    newNumber();
}

function newNumber() {
    input.value = "";
    let number = displayElement.innerText = randNum(0, Math.pow(2, slider.value));
    indicator.innerText = "D";

    if (randNum(0, 2) == 0)
    {
        number = decToBinary(number);
        indicator.innerText = "B";

        if (paddingCheckbox.checked)
        {
            let diff = slider.value - number.length;
            if (diff != 0)
            {
                for (let i = 0; i < diff; i++)
                {
                    number = "0" + number;
                }
            }
        }
    }

    displayElement.innerText = number;
}

reset();
input.focus();