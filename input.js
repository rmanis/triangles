
var InputHandler = function(game) {

    // The game object
    this.game = game;

    // Keys on the keyboard being pressed
    // Key: keycode for a key being pressed
    // Value: true or false
    this.keysPressed = {};

    // Keybindings, functions mapped to keys
    // Key: keycode
    // Value: function for that key
    this.keyBindings = {};
};

InputHandler.prototype.initialize = function() {
    this.setupInputs();
    this.setupKeybindings();
}

InputHandler.prototype.setupInputs = function() {
    function doKeyDown(e) {
        var code = e.keyCode;
        this.keysPressed[code] = true;
    }

    function doKeyUp(e) {
        var code = e.keyCode;
        this.keysPressed[code] = false;
    }

    function doMouseDown(e) {
    }
    function doMouseUp(e) {
    }

    document.addEventListener("keydown", doKeyDown.bind(this), true);
    document.addEventListener("keyup", doKeyUp.bind(this), true);
    this.game.canvas.addEventListener("mousedown",
        doMouseDown.bind(this), true);
    this.game.canvas.addEventListener("mouseup",
        doMouseUp.bind(this), true);
}

InputHandler.prototype.setupKeybindings = function() {
    var bindings = this.keyBindings;
    var mySelf = this.game.getSelf();

    bindings[KEY_LEFT] = mySelf.turnLeft.bind(mySelf);
    bindings[KEY_UP] = mySelf.increaseThrust.bind(mySelf);
    bindings[KEY_RIGHT] = mySelf.turnRight.bind(mySelf);
    bindings[KEY_DOWN] = mySelf.slowDown.bind(mySelf);
}

InputHandler.prototype.update = function() {
    for (var key in this.keysPressed) {
        var binding = this.keyBindings[key];
        if (this.keysPressed[key] && binding) {
            binding();
        }
    }
}
