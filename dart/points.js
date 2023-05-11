var playerList = document.getElementById('player-list');
var hitList = document.getElementById('hit-list');

var starting_points = 301

function create_player(name) {
    // Create player
    let player = document.createElement('div');
    player.className = 'player';
    let nameSpan = document.createElement('span');
    nameSpan.innerHTML = name;
    players.push(player)

    // Player points
    let numSpan = document.createElement('span');
    numSpan.className = 'points-left';
    numSpan.innerHTML = starting_points;
    totalPoints.push(starting_points)

    // Append
    player.appendChild(nameSpan);
    player.appendChild(numSpan);
    playerList.appendChild(player);
}

var players = [];
var totalPoints = [];
var currentPlayer = 0;

var currentHitList = [];
var currentHitsRaw = [];

var pastHitList = [];
var pastHitsRaw = [];

var lookingAtPast = false;
var playerHasWon = -1;
var playerHasBusted = false;

// Soft update the players points
function softUpdate() {
    // Past
    if (lookingAtPast) {
        // currentHitList = hitList.children
        pastHitList = [];
        for (let i = 0; i < hitList.children.length; i++) {
            pastHitList.push(hitList.children[i]);
        }
    }
    // Current
    else {
        // currentHitList = hitList.children
        currentHitList = [];
        for (let i = 0; i < hitList.children.length; i++) {
            currentHitList.push(hitList.children[i]);
        }
    }
    
    let count = 0;
    for (let i = 0; i < hitList.children.length; i++) {
        count += parseInt(hitList.children[i].children[0].innerHTML);
    }
    players[currentPlayer].children[1].innerHTML = totalPoints[currentPlayer] -count;
}

// Hard update the players points
function hardUpdate() {
    // Past
    if (lookingAtPast) {
        // currentHitList = hitList.children
        pastHitList = [];
        for (let i = 0; i < hitList.children.length; i++) {
            pastHitList.push(hitList.children[i]);
        }
    }
    // Current
    else {
        // currentHitList = hitList.children
        currentHitList = [];
        for (let i = 0; i < hitList.children.length; i++) {
            currentHitList.push(hitList.children[i]);
        }
    }
    
    let count = 0;
    for (let i = 0; i < hitList.children.length; i++) {
        count += parseInt(hitList.children[i].children[0].innerHTML);
    }
    totalPoints[currentPlayer] = totalPoints[currentPlayer] - count;
}

function reverseHardUpdate() {
    count = 0;
    for (let i = 0; i < hitList.children.length; i++) {
        count += parseInt(hitList.children[i].children[0].innerHTML);
    }
    totalPoints[currentPlayer] = totalPoints[currentPlayer] + count;
}

// Next Turn button
function nextTurn() {
    // Return if a player has won
    if (playerHasWon !== -1) return;
    // Return if the hit list isn't full and its not a bust
    if (hitList.children.length < 3 && !playerHasBusted) return;
    
    // Normal next turn
    if (!lookingAtPast) {
        // Hard update to save the points
        if (!playerHasBusted) hardUpdate();
       
        // pastHitList = hitList.children
        pastHitList = [];
        for (let i = 0; i < hitList.children.length; i++) {
            pastHitList.push(hitList.children[i]);
        }
        hitList.replaceChildren();
        currentHitList = [];
        
        pastHitsRaw = currentHitsRaw;
        currentHitsRaw = [];
     
        if (playerHasBusted) {
            softUpdate();

            // Don't save past if its a bust (not optimal but it gives so many problem if I don't)
            pastHitList = [];
            pastHitsRaw = [];
        }
        
        // Focus
        players[currentPlayer].className = 'player';
        currentPlayer += 1;
        if (currentPlayer > players.length-1) currentPlayer = 0;
        players[currentPlayer].className = 'player player-focus';
        suggestionButtons()
        checkForWinAndBust()    
    }
    // Get back to present
    else {
        lookingAtPast = false
        
        // hitList.children = currentHitList
        hitList.replaceChildren();
        for (let i = 0; i < currentHitList.length; i++) {
            hitList.appendChild(currentHitList[i]);
        }
        
        // Focus
        players[currentPlayer].className = 'player';
        currentPlayer += 1;
        if (currentPlayer > players.length-1) currentPlayer = 0;
        players[currentPlayer].className = 'player player-focus';
        
        suggestionButtons()
        checkForWinAndBust()
    }
}

// Undo Turn button
function undoLastTurn() {
    // Return if a player has won
    if (playerHasWon !== -1) return;
    // Return if its already looking at past
    if (lookingAtPast) return;
    // Return if there is nothing to undo to
    if (pastHitList.length === 0) return;

    lookingAtPast = true
    
    // hitList.children = pastHitList
    hitList.replaceChildren();
    for (let i = 0; i < pastHitList.length; i++) {
        hitList.appendChild(pastHitList[i]);
    }
        
    // Focus
    players[currentPlayer].className = 'player';
    currentPlayer -= 1;
    if (currentPlayer < 0) currentPlayer = players.length-1;
    players[currentPlayer].className = 'player player-focus';
    
    reverseHardUpdate();
    softUpdate();
    suggestionButtons();
    checkForWinAndBust()
}

function bustButton() {
    // Return if a player has won
    if (playerHasWon !== -1) return;
    
    hitList.replaceChildren();
    currentHitList = [];    
    currentHitsRaw = [];
    
    softUpdate();

    // Don't save past if its a bust (not optimal but it gives so many problem if I don't)
    pastHitList = [];
    pastHitsRaw = [];
        
    // Focus
    players[currentPlayer].className = 'player';
    currentPlayer += 1;
    if (currentPlayer > players.length-1) currentPlayer = 0;
    players[currentPlayer].className = 'player player-focus';
    suggestionButtons()
}

function addToHitList(p) {
    // Return if a player has won
    if (playerHasWon !== -1) return;
    // Return if its a bust
    if (playerHasBusted) return;
    // Return if it has reached the max
    if (hitList.children.length >= 3) return;

    // create the list item (li)
    let listItem = document.createElement('li');
    listItem.className = 'p-list';
    
    // Create the text for the list item (span)
    let span = document.createElement('span');
    span.innerHTML = p[0] * p[1];
        
    if (lookingAtPast) pastHitsRaw.push([p[0], p[1]]);
    else currentHitsRaw.push([p[0], p[1]]);

    // Create the button (X) to remove the list item / hit
    let button = document.createElement('button');
    button.className = 'hit-list-remove-button';
    button.innerHTML = 'X';
    // Button onclick
    button.onclick = () => {
        listItem.remove();
        if (lookingAtPast) pastHitsRaw.splice(hitList.children.length, 1);
        else currentHitsRaw.splice(hitList.children.length, 1);
        softUpdate();
        suggestionButtons();
        checkForWinAndBust();
    }

    // Append
    listItem.appendChild(span);
    listItem.appendChild(button);
    hitList.appendChild(listItem);
    
    softUpdate();
    checkForWinAndBust();
}

// Hide or show the suggestion buttons
function suggestionButtons() {
    let HitsRaw = currentHitsRaw;
    if (lookingAtPast) HitsRaw = pastHitsRaw;

    // A player has won or there is no numbers in list
    if (playerHasWon !== -1 || hitList.children.length === 0) {
        singleButton.style.display = 'none';
        dobbleButton.style.display = 'none';
        trippleButton.style.display = 'none';
    }
    // Last number is 25
    else if (HitsRaw[HitsRaw.length - 1][1] === 25) {
        singleButton.style.display = 'inherit';
        dobbleButton.style.display = 'inherit';
        trippleButton.style.display = 'none'; 
    }
    // Last number is 0
    else if (HitsRaw[HitsRaw.length - 1][1] === 0) {
        singleButton.style.display = 'none';
        dobbleButton.style.display = 'none';
        trippleButton.style.display = 'none';
    }
    // Normal behaviour
    else {
        singleButton.style.display = 'inherit';
        dobbleButton.style.display = 'inherit';
        trippleButton.style.display = 'inherit';
    }
}

// Edits hit list item
function editHitListMult(index, mult) {
    // Return if a player has won
    if (playerHasWon !== -1) return;
    
    let pList = document.getElementsByClassName('p-list');
    
    // Return if the index is outside the list
    if (index >= 0) {
        if (hitList.children.length <= index) return;
    }
    else {
        index = pList.length - -index;
        if (index < 0) return;
        if (hitList.children.length <= index) return;
    }

    if (lookingAtPast) pList[index].children[0].innerHTML = mult * pastHitsRaw[index][1];
    else pList[index].children[0].innerHTML = mult * currentHitsRaw[index][1];

    softUpdate();
    checkForWinAndBust();
}

// Check if the current player has won or busted
function checkForWinAndBust() {
    let HitsRaw = currentHitsRaw;
    if (lookingAtPast) HitsRaw = pastHitsRaw;

    let count = 0;
    for (let i = 0; i < hitList.children.length; i++) {
        count += parseInt(hitList.children[i].children[0].innerHTML);
    }
    // Win
    if (totalPoints[currentPlayer] - count === 0 && HitsRaw[HitsRaw.length - 1][0] == 2) {
        console.log('Player '+currentPlayer+' just won')
        playerHasWon = currentPlayer;
        document.getElementsByClassName('new-game')[0].style.display = 'inherit';
        suggestionButtons();
    }
    // Not Win
    else {
        playerHasWon = -1;
        document.getElementsByClassName('new-game')[0].style.display = 'none';
        // Player busted
        if (totalPoints[currentPlayer] - count <= 1) {
            console.log('Player '+currentPlayer+' just busted')
            playerHasBusted = true;
            players[currentPlayer].children[1].innerHTML = 'Busted';
        }
        else {
            playerHasBusted = false;
        }
    }
}
