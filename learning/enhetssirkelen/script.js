var form = document.getElementById('form');
var input = document.getElementById('input');
var displayElement = document.getElementById("display");
var respons = document.getElementById('respons');
var scoreCount = document.getElementById('score-count');
var piButton = document.getElementById('pi');
var degButton = document.getElementById('deg');
var sqrtButton = document.getElementById('sqrt');

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
    "120°": "2π/3",
    "135°": "3π/4",
    "150°": "5π/6",
    "180°": "π",
    "210°": "7π/6",
    "225°": "5π/4",
    "240°": "4π/3",
    "270°": "3π/2",
    "300°": "5π/3",
    "315°": "7π/4",
    "330°": "11π/6",
    "360°": "2π",
    // Convert r => d
    "π/6": "30°",
    "π/4": "45°",
    "π/3": "60°",
    "π/2": "90°",
    "2π/3": "120°",
    "3π/4": "135°",
    "5π/6": "150°",
    "π": "180°",
    "7π/6": "210°",
    "5π/4": "225°",
    "4π/3": "240°",
    "3π/2": "270°",
    "5π/3": "300°",
    "7π/4": "315°",
    "11π/6": "330°",
    "2π": "360°"
};

var correct = 0;
var tries = 0;

pickTimes = {};
var currentEquation = "";

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function reset() {
    respons.textContent = "Enhetssirkelen Tester";

    correct = 0;
    tries = 0;
    scoreCount.textContent = `${correct}/${tries}`;

    pickTimes = {};
    for (let i = 0; i < Object.keys(EquationList).length; i++)
    {
        pickTimes[i] = 0;
    }
}

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

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = input.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function checkAwnser(inputValue) {
    tries = tries+1;
    let list = EquationList[currentEquation].split(",");

    // Correct
    if (list.includes(inputValue)) {
        respons.innerHTML = '<span style="color:green">Correct</span>';
        correct = correct+1;
    }

    // Incorrect
    else {
        respons.innerHTML = `<span style="color:red">Incorrect</span>, it was:<br>${list[0]}<br>`
        if (inputValue != "") respons.innerHTML += `(not "${inputValue}")`;
    }

    scoreCount.textContent = `${correct}/${tries}`;
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