
define(['common/types/Vector'], function(Vector) {

    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_RIGHT = 39;
    var KEY_DOWN = 40;

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
    };

    InputHandler.prototype.setupInputs = function() {

        var touching = false;

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

        function doTouchMove(e) {
            doMouseMove({ x : e.touches[0].clientX, y : e.touches[0].clientY });
        }

        var touchMove = doTouchMove.bind(this);

        function pointStart(e) {
            var p = new Vector(e.x, e.y);
            var s = this.game.getSelf();
            var f = s.seekPoint.bind(s);
            s.addFact('seekpoint', p);
            s.addFact('seekfunc', f);
            s.addComponent(f);
        }

        function pointEnd(e) {
            var ship = this.game.getSelf();
            var seeker = ship.removeFact('seekfunc');
            ship.removeComponent(seeker);
            ship.removeFact('seekpoint');
        }

        function doMouseDown(e) {
            if (touching) {
                return;
            }
            pointStart(e);
            this.game.canvas.addEventListener("mousemove", mouseMove);
            e.stopPropagation();
        }

        function doMouseUp(e) {
            if (touching) {
                touching = false;
                return;
            }
            pointEnd(e);
            this.game.canvas.removeEventListener("mousemove", mouseMove);
            e.stopPropagation();
        }

        function doTouchStart(e) {
            touching = true;
            pointStart({ x : e.touches[0].clientX, y : e.touches[0].clientY });
            this.game.canvas.addEventListener("touchmove", touchMove);
            e.stopPropagation();
        }

        function doTouchEnd(e) {
            this.game.stomp.debug('doTouchEnd : ' + JSON.stringify(e.touches));
            var point = {};
            if (e.touches.length) {
                point.x = e.touches[0].x;
                point.y = e.touches[0].y;
            }
            pointEnd(point);
            this.game.canvas.removeEventListener("mousemove", mouseMove);
            this.game.canvas.removeEventListener("touchmove", touchMove);
            e.stopPropagation();
        }

        function doDOMScroll(e) {
            this.game.view.changeZoom(e.wheelDelta);
        }
        function doScroll(e) {
            this.game.view.changeZoom(e.wheelDelta);
        }

        document.addEventListener("keydown", doKeyDown.bind(this), true);
        document.addEventListener("keyup", doKeyUp.bind(this), true);
        this.game.canvas.addEventListener("mousedown",
            doMouseDown.bind(this), true);
        this.game.canvas.addEventListener("mouseup",
            doMouseUp.bind(this), true);

        this.game.canvas.addEventListener("touchstart",
            doTouchStart.bind(this), true);
        this.game.canvas.addEventListener("touchend",
            doTouchEnd.bind(this), true);
        this.game.canvas.addEventListener("touchcancel",
            doTouchEnd.bind(this), true);

        this.game.canvas.addEventListener("DOMMouseScroll",
            doDOMScroll.bind(this));
        this.game.canvas.addEventListener("mousewheel",
            doScroll.bind(this));
    };

    InputHandler.prototype.setupKeybindings = function() {
        var bindings = this.keyBindings;
        var mySelf = this.game.getSelf();

        bindings[KEY_LEFT] = mySelf.turnLeft.bind(mySelf);
        bindings[KEY_UP] = mySelf.increaseThrust.bind(mySelf);
        bindings[KEY_RIGHT] = mySelf.turnRight.bind(mySelf);
        bindings[KEY_DOWN] = mySelf.slowDown.bind(mySelf);
    };

    InputHandler.prototype.update = function() {
        for (var key in this.keysPressed) {
            var binding = this.keyBindings[key];
            if (this.keysPressed[key] && binding) {
                binding();
            }
        }
    };
    return InputHandler;
});
