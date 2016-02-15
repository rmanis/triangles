
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

Ship.prototype.addForce = function(force) {
    this.forces.push(force);
}

Ship.prototype.turnLeft = function() {
    this.omega = -this.agility;
}

Ship.prototype.increaseThrust = function() {
    this.addForce(vector(
        this.thrust * Math.cos(this.theta),
        this.thrust * Math.sin(this.theta)
    ));
}

Ship.prototype.turnRight = function() {
    this.omega = this.agility;
}

Ship.prototype.slowDown = function() {
}

