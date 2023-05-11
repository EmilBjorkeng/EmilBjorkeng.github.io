var startScreen = document.getElementById('start-screen');
var dbWrapper = document.getElementById('dart-board-wrapper');
var playerForm = document.getElementById('player-form');

var playersAdded = 2;

function startGame() {
    var inputs = document.getElementsByClassName('form-input');
    for (let i = 0; i < inputs.length; i++) {
        create_player(inputs[i].value);
    }
    players[0].className += ' player-focus';
    
    startScreen.style.display = 'none';
    dbWrapper.style.display = 'inherit';
    
    return false;
}

function addPlayer() {
    playersAdded += 1;
    
    // Create label
    let label = document.createElement('label');
    label.setAttribute("for", 'p'+playersAdded+'name');
    label.innerHTML = 'Player name:'
    
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'p'+playersAdded+'name'
    input.className = 'form-input'
    input.setAttribute('name', 'p'+playersAdded+'name');

    let br = document.createElement('br');
    let br2 = document.createElement('br');

    playerForm.insertBefore(label, playerForm.lastElementChild);
    playerForm.insertBefore(input, playerForm.lastElementChild);
    playerForm.insertBefore(br, playerForm.lastElementChild);
    playerForm.insertBefore(br2, playerForm.lastElementChild);

    var switchPlayers = document.getElementById('switch-players')
    switchPlayers.style.display = 'none';
}

function switchPlayers() {
    var inputs = document.getElementsByClassName('form-input');

    let temp = inputs[0].value
    inputs[0].value = inputs[1].value
    inputs[1].value = temp
}

function start() {
    startScreen.style.display = 'inherit';
    dbWrapper.style.display = 'none';
    document.getElementsByClassName('new-game')[0].style.display = 'none';

    // Reset Settings
    players = [];
    totalPoints = [];
    currentPlayer = 0;

    currentHitList = [];
    currentHitsRaw = [];

    pastHitList = [];
    pastHitsRaw = [];

    lookingAtPast = false;
    playerHasWon = -1;
    playerHasBusted = false;

    document.getElementById('player-list').replaceChildren();
    document.getElementById('hit-list').replaceChildren();
}

start()
