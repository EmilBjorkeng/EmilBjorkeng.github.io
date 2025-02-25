var formElement = document.getElementById('form');
var inputElement = document.getElementById('input');
var infoElement = document.getElementById('info');
var displayElement = document.getElementById('display');
var scoreElement = document.getElementById('score');
var potensButton = document.getElementById('potens');

var EquationListTemplate = {
    "(a + b)²": "a²+2ab+b²,a^2+2ab+b^2",
    "(a - b)²": "a²-2ab+b²,a^2-2ab+b^2",
    "(a + b)(a - b)": "a²-b²,a^2-b^2",
    "a² + 2ab + b²": "(a+b)²,(a+b)^2",
    "a² - 2ab + b²": "(a-b)²,(a-b)^2",
    "a² - b²": "(a+b)(a-b),(a-b)(a+b)",
    "a² + 6a + 9": "(a+3)²,(a+3)^2",
    "a² + 10a + 25": "(a+5)²,(a+5)^2",
    "a² - 6a + 9": "(a-3)²,(a-3)^2",
    "a² - 10a + 25": "(a-5)²,(a-5)^2",
    "a² - 100": "(a+10)(a-10),(a-10)(a+10)",
    "a² - 9": "(a+3)(a-3),(a-3)(a+3)",
    "a² - 25": "(a+5)(a-5),(a-5)(a+5)"
};
// Change a and b into * and # to remove conflict later (Wildcards)
var EquationList = {};
for (const [key, value] of Object.entries(EquationListTemplate)) {
    let newKey = key.replaceAll("a", "*").replaceAll("b", "#");
    let newValue = value.replaceAll("a", "*").replaceAll("b", "#");
    EquationList[newKey] = newValue;
}
var unknownLetterList = "abcdxy";

var correct = 0;
var tries = 0;
pickTimes = {};
var currentEquation = "";
var unknownLetters = [];

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = inputElement.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

potensButton.addEventListener("click", (e) => {
    e.preventDefault();
    input.value += "²";
    input.focus();
});

function reset() {
    infoElement.textContent = "Kvadratsettningene Tester";
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

    // Turn into wildcard for the list making
    let wildCurrentEquation = currentEquation
    .replaceAll(unknownLetters[0], "*").replaceAll(unknownLetters[1], "#");

    let list = EquationList[wildCurrentEquation].split(",");

    // Turn wildcards into unknowns in the list
    for (i = 0; i < list.length; ++i) {
        list[i] = list[i]
        .replaceAll("*", unknownLetters[0]).replaceAll("#", unknownLetters[1]);
    }

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

    // Random unknown
    do {
        unknownLetters[0] = unknownLetterList[randNum(0, unknownLetterList.length)];
        unknownLetters[1] = unknownLetterList[randNum(0, unknownLetterList.length)];
    } while (unknownLetters[0] == unknownLetters[1]);

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
        // Change unknown
        .replaceAll("*", unknownLetters[0]).replaceAll("#", unknownLetters[1]);

        // Check if the letter that was picked isn't picked way more then the lowest picked letter
        // Within the margin set
        if (pickTimes[randomIndex] > lowestValue + margin) continue;

        // Break if its not the same as the last letter
        if (nextEquation != currentEquation) break;
    }

    pickTimes[randomIndex] = pickTimes[randomIndex]+1;
    currentEquation = nextEquation;
    displayElement.textContent = nextEquation;
}

reset();
input.focus();