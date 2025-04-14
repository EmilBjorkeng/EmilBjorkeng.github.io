const lengthDisplay = document.getElementById('length-display');
const input = document.getElementById('text-box');
const lower = document.getElementById('lower');
const upper = document.getElementById('upper');
const inverse = document.getElementById('inverse');
const lettersOnly = document.getElementById('letters-only');

// Length display
function lengthDisplayFunc() {
    // Length
    lengthDisplay.textContent = `Length: ${input.value.length} `;
    // Words
    if (input.value.match(/\w+/g) === null) {
        lengthDisplay.textContent += `Words: 0`;
    }
    else {
        lengthDisplay.textContent += `Words: ${input.value.match(/\w+/g).length}`;
    }
}
input.addEventListener('input', lengthDisplayFunc);
lengthDisplayFunc();

lower.addEventListener('click', function() {
    input.value = input.value.toLowerCase();
});

upper.addEventListener('click', function() {
    input.value = input.value.toUpperCase();
});

inverse.addEventListener('click', function() {
    input.value = input.value.split('').map(function(char) {
        if (char === char.toLowerCase()) {
            return char.toUpperCase();
        }
        else {
            return char.toLowerCase();
        }
    }).join('');
});

lettersOnly.addEventListener('click', function() {
    input.value = input.value.replace(/[^a-zA-Z]/g, '');
});