var formElement = document.getElementById('form');
var inputElement = document.getElementById('input');
var infoElement = document.getElementById('info');
var displayElement = document.getElementById('display');
var scoreElement = document.getElementById('score');
var piButton = document.getElementById('pi');
var degButton = document.getElementById('deg');
var sqrtButton = document.getElementById('sqrt');
var simpleCheckbox = document.getElementById('simple-checkbox');

var EquationList = {
    // 0
    "sin(0)": "0",
    "cos(0)": "1",
    "tan(0)": "0",
    // 30°
    "sin(30°)": "1/2,0.5",
    "cos(30°)": "√3/2",
    "tan(30°)": "1/√3",
    // 45°
    "sin(45°)": "√2/2",
    "cos(45°)": "√2/2",
    "tan(45°)": "1",
    // 60°
    "sin(60°)": "√3/2",
    "cos(60°)": "1/2,0.5",
    "tan(60°)": "√3",
    // 90°
    "sin(90°)": "1",
    "cos(90°)": "0",
    // 1/6 π
    "sin(π/6)": "1/2,0.5",
    "cos(π/6)": "√3/2",
    "tan(π/6)": "1/√3",
    // 1/4 π
    "sin(π/4)": "√2/2",
    "cos(π/4)": "√2/2",
    "tan(π/4)": "1",
    // 1/3 π
    "sin(π/3)": "√3/2",
    "cos(π/3)": "1/2,0.5",
    "tan(π/3)": "√3",
    // 1/2 π
    "sin(π/2)": "1",
    "cos(π/2)": "0",
    // Convert d => r
    "30°": "π/6",
    "45°": "π/4",
    "60°": "π/3",
    "90°": "π/2",
    "180°": "π",
    "270°": "3π/2",
    "360°": "2π",
    // Convert r => d
    "π/6": "30°",
    "π/4": "45°",
    "π/3": "60°",
    "π/2": "90°",
    "π": "180°",
    "3π/2": "270°",
    "2π": "360°",
    // Convert d => r (complex)
    "120°": "2π/3",
    "135°": "3π/4",
    "150°": "5π/6",
    "210°": "7π/6",
    "225°": "5π/4",
    "240°": "4π/3",
    "300°": "5π/3",
    "315°": "7π/4",
    "330°": "11π/6",
    // Convert r => d (complex)
    "2π/3": "120°",
    "3π/4": "135°",
    "5π/6": "150°",
    "7π/6": "210°",
    "5π/4": "225°",
    "4π/3": "240°",
    "5π/3": "300°",
    "7π/4": "315°",
    "11π/6": "330°"
};

var simpleLength = Object.keys(EquationList).length - 18;

var correct = 0;
var tries = 0;

pickTimes = {};
var currentEquation = "";

simpleCheckbox.addEventListener('change', () => {
    reset();
    newEquation();
});

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = inputElement.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

piButton.addEventListener("click", (e) => {
    e.preventDefault();
    input.value += "π";
    input.focus();
});

degButton.addEventListener("click", (e) => {
    e.preventDefault();
    input.value += "°";
    input.focus();
});

sqrtButton.addEventListener("click", (e) => {
    e.preventDefault();
    input.value += "√";
    input.focus();
});

function reset() {
    displayElement.textContent = "Enhetssirkelen Tester";

    correct = 0;
    tries = 0;
    scoreElement.textContent = `${correct}/${tries}`;

    pickTimes = {};

    var length = Object.keys(EquationList).length;
    if (simpleCheckbox.checked) length = simpleLength;

    for (let i = 0; i < length; i++)
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

    var length = Object.keys(EquationList).length;
    if (simpleCheckbox.checked) length = simpleLength;

    // For loop to prevent an endless loop
    for (let i = 0; i < 10000; i++) {
        randomIndex = randNum(0, length);

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