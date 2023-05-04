var singleButton = document.getElementById('make-it-single');
var dobbleButton = document.getElementById('make-it-dobble');
var trippleButton = document.getElementById('make-it-tripple');

function points(e, p) {
    e.stopPropagation();
    if (playerHasWon !== -1) return;
    
    addToHitList(p)
    suggestionButtons()
}

var bg = document.getElementById('dart-board');
bg.addEventListener("click", (e) => { points(e, [1, 0]) }); 

var bullseyeRing = document.getElementById('bullseye-ring');
bullseyeRing.addEventListener("click", (e) => { points(e, [1, 25]) }); 
var bullseye = document.getElementById('bullseye');
bullseye.addEventListener("click", (e) => { points(e, [2, 25]) }); 

var innerBoard = document.getElementById('inner-board');
var numberList = document.getElementById('number-list');
var dartNumList = [ 
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
    3, 19, 7, 16, 8, 11, 14, 9, 12, 5
];

for (let i = 0; i < 20; i++) {
    // Slice
    let slice = document.createElement('div');
    slice.className = 'slice';
    slice.style.transform = `rotate(${18 * i}deg)`;
    slice.addEventListener("click", (e) => { points(e, [1, dartNumList[i]]) }); 

    let dobbleField = document.createElement('div');
    dobbleField.className = 'dobble-field';
    dobbleField.addEventListener("click", (e) => { points(e, [2, dartNumList[i]]) }); 
    let dobbleFieldMask = document.createElement('div');
    dobbleFieldMask.className = 'dobble-field-click-mask';
    
    let trippleField = document.createElement('div');
    trippleField.className = 'tripple-field';
    trippleField.addEventListener("click", (e) => { points(e, [3, dartNumList[i]]) }); 
    let trippleFieldMask = document.createElement('div');
    trippleFieldMask.className = 'tripple-field-click-mask';
    
    if (i % 2 === 0) {
        slice.className += ' even-slice';
        trippleField.className += ' even-tripple-field';
        dobbleField.className += ' even-dobble-field';
    }
    else {
        slice.className += ' odd-slice';
        trippleField.className += ' odd-tripple-field';
        dobbleField.className += ' odd-dobble-field';
    }

    slice.appendChild(dobbleField);
    slice.appendChild(dobbleFieldMask);
    slice.appendChild(trippleField);
    slice.appendChild(trippleFieldMask);
    innerBoard.appendChild(slice);

    // Number
    let numberWrapper = document.createElement('div');
    numberWrapper.className = 'number-wrapper';
    numberWrapper.style.transform = `rotate(${18 * i}deg)`;
    
    let number = document.createElement('div');
    number.className = 'number';
    number.style.transform = `rotate(-${18 * i}deg)`;
    number.innerHTML = dartNumList[i];
    
    numberWrapper.appendChild(number)
    numberList.appendChild(numberWrapper)
}
