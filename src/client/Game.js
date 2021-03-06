
define([
    'client/InputHandler',
    'client/types/Renderer',
    'common/types/Planets',
    'common/types/StompClient',
    'common/types/View',
    'common/Guid',
    'common/Physics',
    ], function(
        InputHandler,
        Renderer,
        Planets,
        StompClient,
        View,
        Guid,
        Physics) {
    var Game = function() {

        // All the ships in the game.
        // Key is the user id
        // Value is their ship
        this.everyone = {};

        // The planets.
        this.planets = new Planets();

        // This player's user id
        this.selfId = null;

        // Canvas object on the page
        this.canvas = null;

        // Context object in the canvas
        this.context = null;

        // The timestamp of the last game update
        this.lastUpdate = 0;

        // The input handler
        this.inputHandler = null;

        // The renderer
        this.renderer = null;

        // The game view
        this.view = new View(this);

        // The stomp client wrapper
        this.stomp = null;
    };

    Game.prototype.initialize = function() {
        this.canvas = document.getElementById("can");
        this.context = this.canvas.getContext("2d");
        this.context.save();

        this.canvas.onselectstart = function() { return false; };

        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();

        this.inputHandler = new InputHandler(this);
        this.inputHandler.initialize();

        this.renderer = new Renderer(this, this.canvas, this.context);

        this.initStomp();
    };

    Game.prototype.initStomp = function() {
        var url = 'ws://' + window.location.hostname + ':61623';
        this.stomp = new StompClient(url, this);

        if (this.stomp) {
            this.stomp.connect(this.selfId, null);
        }
    };

    Game.prototype.resizeCanvas = function() {
        this.context.restore();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context.save();
        this.context.translate(this.canvas.width / 2,
            this.canvas.height / 2);
    };

    Game.prototype.loop = function(arg) {
        var dt = (arg - this.lastUpdate) / 1000;
        this.lastUpdate = arg;
        this.inputHandler.update();
        this.updateEveryone(dt);
        Physics.updateForces(this, dt);
        Physics.updateVel(this, dt);
        Physics.updatePos(this, dt);
        this.view.update();
        this.renderer.drawAll(dt);
        this.stomp.updatePosition(arg, this.getSelf());

        requestAnimationFrame(this.loop.bind(this));
    };

    Game.prototype.updateEveryone = function(dt) {
        for (var k in this.everyone) {
            var o = this.everyone[k];
            o.update(dt);
        }
    };

    Game.prototype.addShip = function(ship, id) {
        if (!id) {
            id = Guid();
        }
        this.everyone[id] = ship;
        return id;
    };

    Game.prototype.getShip = function(id) {
        return this.everyone[id];
    };

    Game.prototype.getSelf = function() {
        return this.everyone[this.selfId];
    };

    Game.prototype.removeShip = function(id) {
        delete this.everyone[id];
    };

    return Game;
});
