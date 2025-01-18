var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var scoreCount = document.getElementById('score-count');
var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');
var rangeSlider = document.getElementById('range-slider');
var rangeSliderValue = document.getElementById('range-slider-value');
var timerDisplay = document.getElementById('timer-display');
var failCheckbox = document.getElementById('fail-checkbox');

var correct = 0;
var tries = 0;

var timer;
var failCheckboxChecked;

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
    if (failCheckboxChecked)
        scoreCount.textContent = `${correct}`;
    else
        scoreCount.textContent = `${correct}/${tries}`;
}

function failCheckboxCheck() {
    if (failCheckbox.checked)
    {
        failCheckboxChecked = true;
        scoreCount.textContent = `${correct}`;
    }
    else
    {
        failCheckboxChecked = false;
        scoreCount.textContent = `${correct}/${tries}`;
    }
}
failCheckboxCheck()
failCheckbox.addEventListener('change', failCheckboxCheck);

function sliderText() {
    if (slider.value == 11) {
        sliderValue.innerText = "";
        timerDisplay.textContent = "";
        return;
    }
    timerDisplay.textContent = `${slider.value}s`;
    sliderValue.innerText = slider.value;
}
sliderText();
slider.addEventListener("input", sliderText)

function rangeSliderText() {
    rangeSliderValue.innerText = rangeSlider.value;
}
rangeSliderText();
rangeSlider.addEventListener("input", rangeSliderText)


form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    let inputValue = input.value.toLowerCase();
    timerDisplay.textContent = `${parseInt(slider.value)}s`;
    checkAwnser(inputValue);
});

function checkAwnser(inputValue) {
    tries = tries+1;

    // Correct
    if (list.includes(inputValue)) {

        // Show also correct awnsers
        if(list.length > 1) {
            list.splice(list.indexOf(inputValue), 1);
            respons.innerHTML = `<span style="color:green">Correct</span>, also correct: ${list}`;
        }

        // Default correct message
        else {
            respons.innerHTML = '<span style="color:green">Correct</span>';
        }

        correct = correct+1;
    }

    // Incorrect
    else {
        respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${natoAlfabetDictionary[currentLetter]}`;
        if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;

        if (failCheckboxChecked)
        {
            reset();
            newLetter()
            clearTimeout(timer);
            input.focus();

            respons.innerHTML = `<span style="color:red">Incorrect</span>, it was: ${natoAlfabetDictionary[currentLetter]}`;
            if (inputValue != "") respons.innerHTML += ` (not "${inputValue}")`;

            return;
        }
    }

    if (failCheckboxChecked)
        scoreCount.textContent = `${correct}`;
    else
        scoreCount.textContent = `${correct}/${tries}`;
    newNumber();
}

function newNumber() {
    input.value = "";

    // Update variables
    pickTimes[nextLetter] = pickTimes[nextLetter]+1;
    currentLetter = nextLetter;
    displayElement.textContent = currentLetter.toUpperCase();

    let timeleft = parseInt(slider.value);
    if (timeleft == 11) return;
    timer = setInterval(function(){
        timerDisplay.textContent = `${timeleft}s`;
        if(timeleft <= 0){
            clearTimeout(timer);
            checkAwnser("");
            return;
        }
        timeleft -= 1;
    }, 1000);
}

reset();
newLetter();
clearTimeout(timer);
input.focus();