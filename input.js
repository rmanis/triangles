
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

    function doMouseMove(e) {
        var s = this.game.getSelf();
        var p = new Vector(e.x, e.y);
        s.addFact('seekpoint', p);
        e.stopPropagation();
    }

    var mouseMove = doMouseMove.bind(this);

    function doMouseDown(e) {
        var p = vector(e.x, e.y);
        var s = this.game.getSelf();
        var f = s.seekPoint.bind(s);
        s.addFact('seekpoint', p);
        s.addFact('seekfunc', f);
        s.addTicker(f);

        this.game.canvas.addEventListener("mousemove", mouseMove);
        e.stopPropagation();
    }

    function doMouseUp(e) {
        var ship = this.game.getSelf();
        var seeker = ship.removeFact('seekfunc');
        ship.removeTicker(seeker);

        ship.removeFact('seekpoint');

        this.game.canvas.removeEventListener("mousemove", mouseMove);
        e.stopPropagation();
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
