var playerList = document.getElementById('player-list');
var hitList = document.getElementById('hit-list');

var playerEntities = [];
var playerPoints = [];
var playerHitList = [];
var playerStats = [];

var currentPlayer = 0;
var playerHasWon = false;
var playerIsBust = false;

var starting_points = 301;

function create_player(name) {
    // Create player
    let player = document.createElement('div');
    player.className = 'player';
    let nameSpan = document.createElement('span');
    nameSpan.innerHTML = name;
    playerEntities.push(player)         // Player entities

    // Player points
    let numSpan = document.createElement('span');
    numSpan.className = 'points-left';
    numSpan.innerHTML = starting_points;
    playerPoints.push(starting_points)  // Player points

    // Append
    player.appendChild(nameSpan);
    player.appendChild(numSpan);
    playerList.appendChild(player);
    
    playerHitList.push([])              // Player hit list
}

function points(e, p) {
    e.stopPropagation();
    if (playerHasWon) return;
    if (playerIsBust) return;
    if (playerHitList[currentPlayer].length > 2) return;

    let points = p[1];
    let mult = p[0];

    // create the list item (li)
    let listItem = document.createElement('li');
    listItem.className = 'p-list';

    // Create the text for the list item (span)
    let span = document.createElement('span');
    var multChar = ['0x','','D','T']
    span.innerHTML = multChar[mult]+points;

    // Create the button (X) to remove the list item / hit
    let button = document.createElement('button');
    button.className = 'hit-list-remove-button';
    button.innerHTML = 'X';
    // Button onclick
    button.onclick = () => {
        listItem.remove();
        playerHitList[currentPlayer].splice(hitList.children.length, 1);
        softUpdate();
        
        updateWinBustStatus();
        suggestionButtons();
    }

    // Append
    listItem.appendChild(span);
    listItem.appendChild(button);
    hitList.appendChild(listItem);

    playerHitList[currentPlayer].push([mult, points]);
    softUpdate();
    updateWinBustStatus();
    suggestionButtons();
}

function softUpdate() {
    var newPointAmt = playerPoints[currentPlayer];
    for (let i = 0; i < playerHitList[currentPlayer].length; i++) {
        newPointAmt -= playerHitList[currentPlayer][i][0] * playerHitList[currentPlayer][i][1];
    }
    playerEntities[currentPlayer].children[1].innerHTML = newPointAmt;
    return newPointAmt;
}

function hardUpdate() {
    let newPointAmt = softUpdate();
    playerPoints[currentPlayer] = newPointAmt;
}

function nextTurn() {
    // Return if a player has won
    if (playerHasWon) return;
    // Return if the hit list isn't full and its not a bust
    if (playerHitList[currentPlayer].length < 3 && !playerIsBust) return;
    
    if (!playerIsBust) hardUpdate();
    else playerEntities[currentPlayer].children[1].innerHTML = playerPoints[currentPlayer];
    playerIsBust = false;

    currentPlayer += 1;
    if (currentPlayer > playerEntities.length-1) {
        currentPlayer = 0;
    }

    if (playerHitList[currentPlayer].length > 0) {
        playerHitList[currentPlayer] = []
    }
    
    updatePlayerPointer();
    hitList.replaceChildren();
    suggestionButtons();
}

function undoLastTurn() {

}

function updatePlayerPointer() {
    for (let i = 0; i < playerEntities.length; i++) {
        playerEntities[i].className = 'player';
    }
    playerEntities[currentPlayer].className = 'player player-focus';
}

function bustButton() {
    // Return if a player has won
    if (playerHasWon) return;
    
    playerEntities[currentPlayer].children[1].innerHTML = playerPoints[currentPlayer];
    playerIsBust = false;

    currentPlayer += 1;
    if (currentPlayer > playerEntities.length-1) {
        currentPlayer = 0;
    }

    if (playerHitList[currentPlayer].length > 0) {
        playerHitList[currentPlayer] = []
    }
    
    updatePlayerPointer();
    hitList.replaceChildren();
    suggestionButtons();
}

function suggestionButtons() {
    // A player has won or there is no numbers in list
    if (playerHasWon || hitList.children.length === 0) {
        singleButton.style.display = 'none';
        dobbleButton.style.display = 'none';
        trippleButton.style.display = 'none';
    }
    // Last number is 25
    else if (playerHitList[currentPlayer][playerHitList[currentPlayer].length - 1][1] === 25) {
        singleButton.style.display = 'inherit';
        dobbleButton.style.display = 'inherit';
        trippleButton.style.display = 'none'; 
    }
    // Last number is 0
    else if (playerHitList[currentPlayer][playerHitList[currentPlayer].length - 1][1] === 0) {
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

function editHitListMult(index, mult) {
    // Return if a player has won
    if (playerHasWon) return;
    
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

    var multChar = ['0x','','D','T']
    pList[index].children[0].innerHTML = multChar[mult]+playerHitList[currentPlayer][index][1];
    playerHitList[currentPlayer][index] = [mult, playerHitList[currentPlayer][index][1]]

    softUpdate();
    updateWinBustStatus();
}

function updateWinBustStatus() {
    let count = 0;
    for (let i = 0; i < playerHitList[currentPlayer].length; i++) {
        count += playerHitList[currentPlayer][i][0] * playerHitList[currentPlayer][i][1];
    }
    
    // Win
    if (playerPoints[currentPlayer] - count == 0 && 
        playerHitList[currentPlayer][playerHitList[currentPlayer].length - 1][0] == 2) {
        
        console.log('Player '+currentPlayer+' just won')    
        playerHasWon = true;
    }
    // Not Win
    else {
        playerHasWin = false;

        // Busted
        if (playerPoints[currentPlayer] - count <= 1) {
            console.log('Player '+currentPlayer+' just busted')
            playerIsBust = true;
            playerEntities[currentPlayer].children[1].innerHTML = 'Busted';
        }
        else {
            playerIsBust = false;
        }
    }
}
