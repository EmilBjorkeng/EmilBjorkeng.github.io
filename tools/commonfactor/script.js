const input = document.getElementById('text-box');
const factorsDisplay = document.getElementById('factors-display');

function isNumber(string) {
    if (typeof string != "string") return false;
    return !isNaN(string) && !isNaN(parseFloat(string));
}

function isPrime(number) {
    if (number == 2) return true;
    for (let i = 2; i < Math.pow(number, 0.5) + 1; ++i) {
        if (number % i == 0) return false;
    }
    return true;
}

input.addEventListener('input', (e) => {
    if (e.target.value == "") {
        factorsDisplay.textContent = '';
        return;
    }

    // Parsing
    var numbers = e.target.value.replace(/\s/g, "").split(',');
    for (let i = 0; i < numbers.length; i++) {
        if (isNumber(numbers[i])) {
            numbers[i] = parseFloat(numbers[i]);
        } else {
            numbers = "NaN";
            break;
        }
    }
    // Input error
    if (numbers == "NaN") {
        factorsDisplay.textContent = `Error with input`;
        return;
    }
    // Finding factors
    var factors = [];
    for (let i = 0; i < numbers.length; i++) {
        factors[i] = [1];
        if (isPrime(numbers[i])) {
            continue;
        }
        for (let j = 2; j < numbers[i]; j++) {
            if (numbers[i] % j == 0) {
                factors[i].push(j);
            }
        }
    }
    // Filter the factors
    var commonFactors = [];
    for (let i = 0; i < factors.length; i++) {
        if (commonFactors.length == 0) {
            commonFactors = factors[i];
            continue;
        }
        commonFactors = commonFactors.filter(x => factors[i].includes(x));
    }

    factorsDisplay.textContent = `${commonFactors}`;
});