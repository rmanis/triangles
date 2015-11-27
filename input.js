
function setupInputs(odb) {
    function doKeyDown(e) {
        var code = e.keyCode;
        odb.keysPressed[code] = true;
    }

    function doKeyUp(e) {
        var code = e.keyCode;
        odb.keysPressed[code] = false;
    }

    function doMouseDown(e) {
    }
    function doMouseUp(e) {
    }

    document.addEventListener("keydown", doKeyDown, true);
    document.addEventListener("keyup", doKeyUp, true);
    odb.canvas.addEventListener("mousedown", doMouseDown, true);
    odb.canvas.addEventListener("mouseup", doMouseUp, true);
    setupKeybindings(odb);
}

function setupKeybindings(odb) {
    var bindings = odb.keyBindings;
    bindings[KEY_LEFT] = function() {
        turnLeft(odb.everyone[odb.selfId]);
    };
    bindings[KEY_UP] = function() {
        increaseThrust(odb.everyone[odb.selfId]);
    };
    bindings[KEY_RIGHT] = function() {
        turnRight(odb.everyone[odb.selfId]);
    };
    bindings[KEY_DOWN] = function() {
        slowDown(odb.everyone[odb.selfId]);
    };
}
