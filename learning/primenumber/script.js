const formElement = document.getElementById('form');
const inputElement = document.getElementById('input');
const infoElement = document.getElementById('info');
const displayElement = document.getElementById('display');
const scoreElement = document.getElementById('score');
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');
const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
const countCheckbox = document.getElementById('count-checkbox');

var correct = 0;
var tries = 0;

yes.addEventListener("click", (e) => {
    e.preventDefault();
    checkAwnser("yes");
});

no.addEventListener("click", (e) => {
    e.preventDefault();
    checkAwnser("no");
});

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}

countCheckbox.addEventListener('change', () => {
    if (countCheckbox.checked)
        displayElement.innerText = "1";
    else
        displayElement.innerText = randNum(0, slider.value);
});

function sliderText() {
    sliderValue.innerText = slider.value;
}
sliderText();
slider.addEventListener("input", sliderText)

function reset() {
    infoElement.textContent = "Prime number Tester";
    correct = 0;
    tries = 0;
    scoreElement.textContent = `Score: ${correct}/${tries}`;
}

function checkAwnser(inputValue) {
    tries = tries+1;
    let displayNum = displayElement.innerText;
    let isNumPrime = isPrime(displayNum);

    // Correct
    if ((inputValue == "yes" && isNumPrime) || (inputValue == "no" && !isNumPrime)) {
        infoElement.innerHTML = '<span style="color:#0CAA07">Correct</span>';
        correct = correct+1;
    }

    // Incorrect
    else {
        infoElement.innerHTML = `<span style="color:#BF0606">Incorrect</span>`;
    }

    scoreElement.textContent = `${correct}/${tries}`;
    newEquation();
}

function newEquation() {
    if (countCheckbox.checked)
        displayElement.innerText = parseInt(displayElement.innerText)+1;
    else
        displayElement.innerText = randNum(1, slider.value);
}

reset();
if (countCheckbox.checked) displayElement.innerText = "0";
newEquation();