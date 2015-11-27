
var KEY_LEFT = 37;
var KEY_UP = 38
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var epsilon = 0.000001;

var Ship = function(attr) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = 10;
    this.mass = 1;

    this.theta = Math.PI * 7 / 8;
    this.omega = 0;

    this.mu = 0.05;

    this.thrust = 25;
    this.agility = Math.PI * 2;

    this.forces = [];

    for (var k in attr) {
        if (this.hasOwnProperty(k)) {
            this[k] = attr[k];
        }
    }
};

function makeGame() {
    return {
        everyone: {
        },
        selfId: null,
        canvas: null,
        context: null,
        lastUpdate: 0,
        keysPressed: {
        },
        keyBindings: {
        },
        view: {
            center: vector(0,0),
            zoom: 1,
            spacing: 250,
            bigSpacing: 1000,
            gridSize: 3
        }
    };
}

function getSelf(game) {
    return game.everyone[game.selfId];
}

function makeGuid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" +
        S4() + "-4" +
        S4().substr(0,3) + "-" +
        S4() + "-" +
        S4() + S4() + S4()).toLowerCase();
}

function vector(x, y) {
    return { x: x, y: y };
}
