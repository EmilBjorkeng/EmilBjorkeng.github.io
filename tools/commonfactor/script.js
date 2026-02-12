const input = document.getElementById('text-box');
const factorsDisplay = document.getElementById('factors-display');
const primeDisplay = document.getElementById('prime-display');

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

function computeFactors() {
    if (input.value == "") {
        factorsDisplay.textContent = "";
        primeDisplay.textContent = "";
        return;
    }

    // Parsing
    var numbers = input.value.replace(/\s/g, "").split(',');
    var primes = [];
    for (let i = 0; i < numbers.length; i++) {
        if (isNumber(numbers[i])) {
            numbers[i] = parseFloat(numbers[i]);
            if (isPrime(numbers[i])) primes.push(numbers[i]);
        }
        else {
            numbers = "NaN";
            break;
        }
    }

    // Input error
    if (numbers == "NaN") {
        factorsDisplay.textContent = "Error with input";
        primeDisplay.textContent = "";
        return;
    }

    // Finding factors
    var factors = [];
    for (let i = 0; i < numbers.length; i++) {
        factors[i] = [1];
        if (isPrime(numbers[i])) {
            factors[i].push(numbers[i]);
            continue;
        }
        for (let j = 2; j <= numbers[i]; j++) {
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
    primeDisplay.textContent = "";

    if (primes.length > 0) {
        primes.sort((a, b) => Number(a) - Number(b));

        let primeString = "";
        for (let i = 0; i < primes.length; i++) {
            primeString += `${primes[i]}, `
        }
        primeString = primeString.slice(0, -2);

        // Single
        if (primes.length == 1) {
            primeString += " is a prime"
        }
        // Multiple
        else {
            const commaIndex = primeString.lastIndexOf(',');
                primeString = primeString.slice(0, commaIndex) + " and" +
                    primeString.slice(commaIndex + 1) + " are primes";
        }

        primeDisplay.textContent = primeString;
    }
}
input.addEventListener('input', computeFactors);
computeFactors();