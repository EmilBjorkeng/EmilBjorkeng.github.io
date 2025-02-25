var formElement = document.getElementById('form');
var inputElement = document.getElementById('input');
var infoElement = document.getElementById('info');
var displayElement = document.getElementById('display');
var scoreElement = document.getElementById('score');
var cosaButton = document.getElementById('cosa');
var cosbButton = document.getElementById('cosb');
var sinaButton = document.getElementById('sina');
var sinbButton = document.getElementById('sinb');
var tanaButton = document.getElementById('tana');
var tanbButton = document.getElementById('tanb');
var potensButton = document.getElementById('potens');


var trigButtons = [cosaButton, cosbButton, sinaButton, sinbButton, tanaButton, tanbButton];

var EquationList = {
    "sin(a+b)": "sin(a)*cos(b)+sin(b)*cos(a),sina*cosb+sinb*cosa",
    "sin(a-b)": "sin(a)*cos(b)-sin(b)*cos(a),sina*cosb-sinb*cosa",
    "cos(a+b)": "cos(a)*cos(b)-sin(a)*sin(b),cosa*cosb-sina*sinb",
    "cos(a-b)": "cos(a)*cos(b)+sin(a)*sin(b),cosa*cosb+sina*sinb",
    "tan(a+b)": "tan(a)+tan(b)/1-tan(a)*tan(b),tana+tanb/1-tana*tanb",
    "tan(a-b)": "tan(a)-tan(b)/1+tan(a)*tan(b),tana-tanb/1+tana*tanb",
    "sin(2v)": "2*sinv*cosv,2sinv*cosv,2*sin(v)*cos(v),2sin(v)*cos(v)",
    "cos(2v)": "cos²(v)-sin²(v),cos²v-sin²v,cos^2(v)-sin^2(v),cos^2v-sin^2v"
};

var correct = 0;
var tries = 0;

pickTimes = {};
var currentEquation = "";

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

trigButtons.forEach(e => {
    e.addEventListener("click", (e) => {
        e.preventDefault();
        input.value += e.target.value;
        input.focus();
    });
});

potensButton.addEventListener("click", (e) => {
    e.preventDefault();
    input.value += "²";
    input.focus();
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = input.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function reset() {
    displayElement.textContent = "Trigonometri Tester";

    correct = 0;
    tries = 0;
    scoreElement.textContent = `${correct}/${tries}`;

    pickTimes = {};
    for (let i = 0; i < Object.keys(EquationList).length; i++)
    {
        pickTimes[i] = 0;
    }
}

function checkAwnser(inputValue) {
    tries = tries+1;
    let list = EquationList[currentEquation].split(",");

    // Correct
    if (list.includes(inputValue)) {
        infoElement.innerHTML = '<span style="color:green">Correct</span>';
        correct = correct+1;
    }

    // Incorrect
    else {
        infoElement.innerHTML = `<span style="color:red">Incorrect</span>, it was:<br>${list[0]}<br>`
        if (inputValue != "") infoElement.innerHTML += `(not "${inputValue}")`;
    }

    scoreElement.textContent = `${correct}/${tries}`;
    newEquation();
}

function newEquation() {
    input.value = ""

    // Get the pick value of the lowest picked letters
    let lowestValue = 999999; // Set to arbitrary high number
    for (const [key, value] of Object.entries(pickTimes)) {
        if (value < lowestValue) lowestValue = value;
    }

    let nextEquation = "";
    const margin = 1; // Margin for the lowest value (Higher number meaning more possibility of repeat)
    let randomIndex;

    // For loop to prevent an endless loop
    for (let i = 0; i < 10000; i++) {
        randomIndex = randNum(0, Object.keys(EquationList).length);

        let keys = Object.keys(EquationList);
        nextEquation = keys[randomIndex]

        // Check if the letter that was picked isn't picked way more then the lowest picked letter
        // Within the margin set
        if (pickTimes[randomIndex] > lowestValue + margin) continue;

        // Break if its not the same as the last letter
        if (nextEquation != currentEquation) break;
    }

    // Update variables
    pickTimes[randomIndex] = pickTimes[randomIndex]+1;
    currentEquation = nextEquation;
    displayElement.textContent = currentEquation;
}

reset();
newEquation();
input.focus();