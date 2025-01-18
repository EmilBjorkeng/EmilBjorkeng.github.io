var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var scoreCount = document.getElementById('score-count');
var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');
var timerDisplay = document.getElementById('timer-display');
var failCheckbox = document.getElementById('fail-checkbox');

var alfabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var natoAlfabetDictionary = {
    "a": "alfa,alpha",
    "b": "bravo",
    "c": "charlie",
    "d": "delta",
    "e": "echo",
    "f": "foxtrot",
    "g": "golf",
    "h": "hotel",
    "i": "india",
    "j": "juliett",
    "k": "kilo",
    "l": "lima",
    "m": "mike",
    "n": "november",
    "o": "oscar",
    "p": "papa",
    "q": "quebec",
    "r": "romeo",
    "s": "sierra",
    "t": "tango",
    "u": "uniform",
    "v": "victor",
    "w": "whiskey",
    "x": "x-ray,xray",
    "y": "yankee",
    "z": "zulu"
};

var correct = 0;
var tries = 0;

var pickTimes = {};
var currentLetter = "";

var timer;

var failCheckboxChecked;

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function reset() {
    respons.textContent = "Nato Alphabet Tester";

    correct = 0;
    tries = 0;
    if (failCheckboxChecked)
        scoreCount.textContent = `${correct}`;
    else
        scoreCount.textContent = `${correct}/${tries}`;

    pickTimes = {
        "a": 0, "b": 0, "c": 0, "d": 0, "e": 0, "f": 0, "g": 0,
        "h": 0, "i": 0, "j": 0, "k": 0, "l": 0, "m": 0, "n": 0,
        "o": 0, "p": 0, "q": 0, "r": 0, "s": 0, "t": 0, "u": 0,
        "v": 0, "w": 0, "x": 0, "y": 0, "z": 0
    }
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


form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    let inputValue = input.value.toLowerCase();
    timerDisplay.textContent = `${parseInt(slider.value)}s`;
    checkAwnser(inputValue);
});

function checkAwnser(inputValue) {
    tries = tries+1;
    let list = natoAlfabetDictionary[currentLetter].split(",")

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
    newLetter();
}

function newLetter() {
    input.value = "";

    // Get the pick value of the lowest picked letters
    let lowestValue = 999999; // Set to arbitrary high number
    for (const [key, value] of Object.entries(pickTimes)) {
        if (value < lowestValue) lowestValue = value;
    }

    let nextLetter = "";
    const margin = 1; // Margin for the lowest value (Higher number meaning more possibility of repeat)

    // For loop to prevent an endless loop
    for (let i = 0; i < 10000; i++) {
        nextLetter = alfabet[randNum(0, 26)];

        // Check if the letter that was picked isn't picked way more then the lowest picked letter
        // Within the margin set
        if (pickTimes[nextLetter] > lowestValue + margin) continue;

        // Break if its not the same as the last letter
        if (nextLetter != currentLetter) break;
    }

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