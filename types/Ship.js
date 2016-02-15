
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

