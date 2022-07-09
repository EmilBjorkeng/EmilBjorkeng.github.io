var canvas;

document.addEventListener("click", function(event) {
    if (event.target.closest("canvas")) return;
    if (!canvas) return;

    document.body.removeChild(document.body.childNodes[0]);
})

function startSnake() {
    canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    
    const mapHeight = 20;
    const mapWidth = 20;
    const gridSize = 40;
    
    var snakePos = [[Math.floor((mapWidth - 1) / 2) - 3, Math.floor((mapHeight - 1) / 2)]];
    var applePos = [Math.floor((mapWidth - 1) / 2) + 4, Math.floor((mapHeight - 1) / 2)];
    var snakeVel = [0, 0];
    var inputStack = [];
    
    // Create Window
    canvas.width = mapWidth * gridSize;
    canvas.height = mapHeight * gridSize;
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    var mainLoopInterval = setInterval(mainLoop, 1000 / 5);
    
    // Keyboard Input
    document.addEventListener('keydown', function(event) {
        let keyCode = event.keyCode;
        // Up
        if (keyCode == 87 || keyCode == 38)
            inputStack.push([0, -1]);
        // Down
        else if (keyCode == 83 || keyCode == 40)
            inputStack.push([0, 1]);
        // Left
        else if (keyCode == 65 || keyCode == 37)
            inputStack.push([-1, 0]);
        // Right
        else if (keyCode == 68 || keyCode == 39)
            inputStack.push([1, 0]);
        // F (Debug)
        else if (keyCode == 70)
            snakePos.push([-1, -1]);
    });
    
    function game_over(reason) {
        clearInterval(mainLoopInterval);
    }
    
    function mainLoop() {
        // Win Game
        if (snakePos.length >= mapHeight * mapWidth)
            return game_over(0);
    
        // Input stack
        if (inputStack.length) {
            // Loop in case there is impossible moves
            while (true) {
                if (!inputStack.length) break;
    
                // Get velosity from the input stack
                if (!(inputStack[0][0] && snakeVel[0]) && !(inputStack[0][1] && snakeVel[1])) {
                    snakeVel[0] = inputStack[0][0];
                    snakeVel[1] = inputStack[0][1];
                    inputStack.shift();
                    break;
                }
                inputStack.shift();
            }
        }
        // Calculate Snake Tail
        for (let i = snakePos.length - 1; i > 0; i--) {
            snakePos[i][0] = snakePos[i - 1][0];
            snakePos[i][1] = snakePos[i - 1][1];
        }
        // Move Snake Head
        snakePos[0][0] += snakeVel[0];
        snakePos[0][1] += snakeVel[1];
    
        // Hit Tail
        for (let i = 1; i < snakePos.length; i++) {
            if (snakePos[0][0] == snakePos[i][0] && snakePos[0][1] == snakePos[i][1])
                return game_over(1/*"Hit Tail"*/);
        }
        // Hit Wall
        if (snakePos[0][0] < 0 || snakePos[0][0] > mapWidth - 1 || snakePos[0][1] < 0 || snakePos[0][1] > mapHeight - 1)
            return game_over(1/*"Hit Wall"*/);
    
        // Eat Apple
        if (snakePos[0][0] == applePos[0] && snakePos[0][1] == applePos[1]) {
            snakePos.push([-1, -1]);
            // Random Apple Posision
            while (true) {
                x = Math.floor(Math.random() * mapWidth);
                y = Math.floor(Math.random() * mapHeight);
    
                let something_there = false;
    
                for (let i = 0; i < snakePos.length; i++) {
                    if (snakePos[i][0] == x && snakePos[i][1] == y)
                        something_there = true;
                }
    
                if (!something_there) {
                    applePos = [x, y];
                    break;
                }
            }
        }
        
        // Clear screen
        ctx.fillStyle = "#fcfcff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Snake
        ctx.fillStyle = "#0000ff";
        for (let i = 0; i < snakePos.length; i++) {
            ctx.fillRect(snakePos[i][0] * gridSize, snakePos[i][1] * gridSize, gridSize, gridSize);
        }
    
        // Apple
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(applePos[0] * gridSize, applePos[1] * gridSize, gridSize, gridSize);
    }
}