var formElement = document.getElementById('form');
var inputElement = document.getElementById('input');
var infoElement = document.getElementById('info');
var displayElement = document.getElementById('display');
var scoreElement = document.getElementById('score');

var EquationList = {
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
pickTimes = {};
var currentEquation = "";

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = inputElement.value.toLowerCase();
    checkAwnser(inputValue);
});

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function reset() {
    infoElement.textContent = "Nato Alphabet Tester";
    correct = 0;
    tries = 0;
    scoreElement.textContent = `Score: ${correct}/${tries}`;
    pickTimes = {};
    for (let i = 0; i < Object.keys(EquationList).length; i++)
    {
        pickTimes[i] = 0;
    }
    newEquation();
}

function checkAwnser(inputValue) {
    tries = tries+1;
    let list = EquationList[currentEquation].split(",");

    // Correct
    if (list.includes(inputValue)) {
        infoElement.innerHTML = '<span style="color:#0CAA07">Correct</span>';
        correct = correct+1;
    }

    // Incorrect
    else {
        infoElement.innerHTML = `<span style="color:#BF0606">Incorrect</span>, it was: ${list[0]} `
        if (inputValue != "") infoElement.innerHTML += `(not "${inputValue}")`;
    }

    scoreElement.textContent = `Score: ${correct}/${tries}`;
    newEquation();
}

function newEquation() {
    input.value = ""

    // Get the pick value of the lowest picked letters
    let lowestValue = 9999; // Set to arbitrary high number
    for (const [key, value] of Object.entries(pickTimes)) {
        if (value < lowestValue) lowestValue = value;
    }

    let nextEquation = "";
    const margin = 1; // Margin for the lowest value (Higher number meaning more possibility of repeat)
    let randomIndex;

    while (true) {
        randomIndex = randNum(0, Object.keys(EquationList).length);

        let keys = Object.keys(EquationList);
        nextEquation = keys[randomIndex]

        // Check if the letter that was picked isn't picked way more then the lowest picked letter
        // Within the margin set
        if (pickTimes[randomIndex] > lowestValue + margin) continue;

        // Break if its not the same as the last letter
        if (nextEquation != currentEquation) break;
    }

    pickTimes[randomIndex] = pickTimes[randomIndex]+1;
    currentEquation = nextEquation;
    displayElement.textContent = nextEquation.toUpperCase();
}

reset();
input.focus();