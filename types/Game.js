
var Game = function() {

    // All the ships in the game.
    // Key is the user id
    // Value is their ship
    this.everyone = {};

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

    // The game view
    this.view = new View();
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
    updateForces(this, dt);
    updateVel(this, dt);
    updatePos(this, dt);
    updateView(this);
    drawAll(this, dt);

    requestAnimationFrame(this.loop.bind(this));
};

Game.prototype.addShip = function(ship) {
    var id = makeGuid();
    this.everyone[id] = ship;
    return id;
};

Game.prototype.getSelf = function() {
    return this.everyone[this.selfId];
};
