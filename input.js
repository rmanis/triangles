
function setupInputs(game) {
    function doKeyDown(e) {
        var code = e.keyCode;
        game.keysPressed[code] = true;
    }

    function doKeyUp(e) {
        var code = e.keyCode;
        game.keysPressed[code] = false;
    }

    function doMouseDown(e) {
    }
    function doMouseUp(e) {
    }

    document.addEventListener("keydown", doKeyDown, true);
    document.addEventListener("keyup", doKeyUp, true);
    game.canvas.addEventListener("mousedown", doMouseDown, true);
    game.canvas.addEventListener("mouseup", doMouseUp, true);
    setupKeybindings(game);
}

function setupKeybindings(game) {
    var bindings = game.keyBindings;
    bindings[KEY_LEFT] = function() {
        turnLeft(game.everyone[game.selfId]);
    };
    bindings[KEY_UP] = function() {
        increaseThrust(game.everyone[game.selfId]);
    };
    bindings[KEY_RIGHT] = function() {
        turnRight(game.everyone[game.selfId]);
    };
    bindings[KEY_DOWN] = function() {
        slowDown(game.everyone[game.selfId]);
    };
}
