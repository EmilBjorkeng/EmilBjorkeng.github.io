var lengthDisplay = document.getElementById('length-display');
var input = document.getElementById('text-box');
var lower = document.getElementById('lower');
var upper = document.getElementById('upper');
var inverse = document.getElementById('inverse');
var lettersOnly = document.getElementById('letters-only');

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