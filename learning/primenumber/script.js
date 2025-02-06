var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var scoreCount = document.getElementById('score-count');
var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');
var yesButton = document.getElementById('yes');
var noButton = document.getElementById('no');
var countCheckbox = document.getElementById('count-checkbox');

var correct = 0;
var tries = 0;

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}

function reset() {
    respons.textContent = "Prime Number Tester";

    correct = 0;
    tries = 0;
    scoreCount.textContent = `${correct}/${tries}`;
}

function sliderText() {
    sliderValue.innerText = slider.value;
}
sliderText();
slider.addEventListener("input", sliderText)

yes.addEventListener("click", (e) => {
    e.preventDefault();
    checkAwnser("yes");
});

no.addEventListener("click", (e) => {
    e.preventDefault();
    checkAwnser("no");
});

countCheckbox.addEventListener('change', () => {
    if (countCheckbox.checked)
        displayElement.innerText = "1";
    else
        displayElement.innerText = randNum(0, slider.value);
});

function checkAwnser(inputValue) {
    tries = tries+1;
    let displayNum = displayElement.innerText;
    let isNumPrime = isPrime(displayNum);

    // Correct
    if ((inputValue == "yes" && isNumPrime) || (inputValue == "no" && !isNumPrime)) {
        respons.innerHTML = '<span style="color:green">Correct</span>';
        correct = correct+1;
    }

    // Incorrect
    else {
        respons.innerHTML = `<span style="color:red">Incorrect</span>`;
    }

    scoreCount.textContent = `${correct}/${tries}`;
    newNumber();
}

function newNumber() {
    input.value = "";
    if (countCheckbox.checked)
        displayElement.innerText = parseInt(displayElement.innerText)+1;
    else
        displayElement.innerText = randNum(1, slider.value);
}

reset();
if (countCheckbox.checked) displayElement.innerText = "0";
newNumber();
input.focus();