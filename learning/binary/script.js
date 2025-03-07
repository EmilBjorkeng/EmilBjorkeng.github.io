const formElement = document.getElementById('form');
const inputElement = document.getElementById('input');
const infoElement = document.getElementById('info');
const displayElement = document.getElementById('display');
const scoreElement = document.getElementById('score');
const sliderValue = document.getElementById('slider-value');
const indicator = document.getElementById('indicator');
const paddingCheckbox = document.getElementById('padding-checkbox');

var correct = 0;
var tries = 0;

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = inputElement.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function decToBinary(num) {
    return (num >>> 0).toString(2);
}

function binaryToDec(binary) {
    return parseInt(binary, 2);
}

function sliderText() {
    sliderValue.innerText = `${slider.value} [${Math.pow(2, slider.value)}]`;
    newEquation();
}
sliderText();
slider.addEventListener("input", sliderText)

function reset() {
    infoElement.textContent = "Binary Tester"
}

function checkAwnser(inputValue) {
    tries = tries+1;

    inputValue = parseInt(inputValue); // Remove leading 0
    let displayNum = displayElement.innerText;
    // Binary
    if (indicator.innerText == "B")
    {
        if (inputValue == binaryToDec(displayNum))
        {
            infoElement.innerHTML = '<span style="color:green">Correct</span>';
            correct = correct+1;
        }
        else {
            infoElement.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${binaryToDec(displayNum)}`;
            if (inputValue != "") infoElement.innerHTML += ` (not "${inputValue}")`;
        }
    }
    // Decimal
    else
    {
        if (inputValue == decToBinary(displayNum))
        {
            infoElement.innerHTML = '<span style="color:green">Correct</span>';
            correct = correct+1;
        }
        else {
            infoElement.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${decToBinary(displayNum)}`;
            if (inputValue != "") infoElement.innerHTML += ` (not "${inputValue}")`;
        }
    }

    scoreElement.textContent = `Score: ${correct}/${tries}`;
    newEquation();
}

function newEquation() {
    input.value = ""

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