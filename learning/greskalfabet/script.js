const formElement = document.getElementById('form');
const inputElement = document.getElementById('input');
const infoElement = document.getElementById('info');
const displayElement = document.getElementById('display');
const scoreElement = document.getElementById('score');

const EquationList = {
    "Α": "alfa",
    "α": "alfa",
    "Β": "beta",
    "β": "beta",
    "Γ": "gamma",
    "γ": "gamma",
    "Δ": "delta",
    "δ": "delta",
    "Ε": "epsilon",
    "ε": "epsilon",
    "Ζ": "zeta",
    "ζ": "zeta",
    "Η": "eta",
    "η": "eta",
    "Θ": "theta",
    "θ": "theta",
    "ϑ": "theta",
    "Ι": "jota",
    "ι": "jota",
    "Κ": "kappa",
    "κ": "kappa",
    "Λ": "lambda",
    "λ": "lambda",
    "Μ": "my",
    "μ": "my",
    "Ν": "ny",
    "ν": "ny",
    "Ξ": "ksi",
    "ξ": "ksi",
    "Ο": "omikron",
    "ο": "omikron",
    "Π": "pi",
    "π": "pi",
    "Ρ": "rho",
    "ρ": "rho",
    "Σ": "sigma",
    "σ": "sigma",
    "ς": "sigma",
    "Τ": "tau",
    "τ": "tau",
    "Υ": "ypsilon",
    "υ": "ypsilon",
    "Φ": "fi",
    "φ": "fi",
    "Χ": "xhi",
    "χ": "xhi",
    "Ψ": "psi",
    "ψ": "psi",
    "Ω": "omega",
    "ω": "omaga"
};

var correct = 0;
var tries = 0;

pickTimes = {};
var currentEquation = "";

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputValue = input.value.toLowerCase().replace(/\s/g, "");
    checkAwnser(inputValue);
});

function reset() {
    displayElement.textContent = "Gresk Alfabet Tester";

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
        infoElement.innerHTML = `<span style="color:#BF0606">Incorrect</span>, it was:<br>${list[0]}<br>`
        if (inputValue != "") infoElement.innerHTML += `(not "${inputValue}")`;
    }

    scoreElement.textContent = `Score: ${correct}/${tries}`;
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
input.focus();