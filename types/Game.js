
var Game = function() {
    this.everyone = {};
    this.selfId = null;
    this.canvas = null;
    this.context = null;
    this.lastUpdate = 0;
    this.keysPressed = {};
    this.keyBindings = {};
    this.view = new View();
};

Game.prototype.initialize = function() {
    this.canvas = document.getElementById("can");
    this.context = this.canvas.getContext("2d");
    this.context.save();
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
    updateForces(this, dt);
    updateVel(this, dt);
    updatePos(this, dt);
    updateView(this);
    drawAll(this, dt);

    requestAnimationFrame(this.loop.bind(this));
};

Game.prototype.getSelf = function() {
    return this.everyone[this.selfId];
};
