
define([
    'common/types/Vector',
    'common/types/Coordinate'
], function(Vector, Coordinate) {
    var Ship = function(attr) {

        this.pos = new Coordinate();
        this.vx = 0;
        this.vy = 0;

        this.size = 10;
        this.mass = 1;

        // Heading in radians
        this.theta = 0;
        // Angular velocity in radians/second
        this.omega = 0;

        // Friction constant
        this.mu = 0.05;

        // Thrusting force.  F = m * a
        this.thrust = 25;
        // Turning speed
        this.agility = Math.PI * 2;

        this.forces = [];

        this.components = [];

        this.facts = {};

        for (var k in attr) {
            if (this.hasOwnProperty(k) && k != 'pos') {
                this[k] = attr[k];
            } else if (k === 'pos') {
                this[k] = new Coordinate(
                    new Vector(attr.pos.sec.x, attr.pos.sec.y),
                    new Vector(attr.pos.pos.x, attr.pos.pos.y));
            }
        }
    };

    Ship.prototype.update = function(dt) {
        for (var t in this.components) {
            var component = this.components[t];
            component(dt);
        }
    };

    // Returns a vector representing the ship's heading.
    Ship.prototype.headingVector = function() {
        return new Vector(Math.cos(this.theta), Math.sin(this.theta));
    };

    // Computes the relative heading to a point in space.
    Ship.prototype.headingTo = function(vec) {
        var dif = vec.subtract(this.pos);
        var heading = this.headingVector();
        var ang = heading.angleTo(dif);

        return ang * Math.sign(heading.zcross(dif));
    };

    Ship.prototype.addForce = function(force) {
        this.forces.push(force);
    };

    Ship.prototype.addComponent = function(component) {
        this.components.push(component);
    };

    Ship.prototype.removeComponent = function(component) {
        var i = this.components.indexOf(component);
        if (i >= 0) {
            this.components.splice(i, 1);
        }
    };

    Ship.prototype.addFact = function(k, v) {
        this.facts[k] = v;
    };

    Ship.prototype.getFact = function(k) {
        return this.facts[k];
    };

    Ship.prototype.removeFact = function(k) {
        var f = this.facts[k];
        delete this.facts[k];

        return f;
    };

    Ship.prototype.agilityCheck = function(omega) {
        if (omega === undefined) {
            return this.agility;
        }

        var amount = omega || this.agility;
        if (amount < 0) {
            if (amount < -this.agility) {
                amount = -this.agility;
            }
        } else {
            if (amount > this.agility) {
                amount = this.agility;
            }
        }
        return amount;
    };

    Ship.prototype.turnLeft = function(omega) {
        this.omega = -this.agilityCheck(omega);
    };

    Ship.prototype.increaseThrust = function(multiplier) {
        var m = Math.abs(multiplier || 1.0);
        if (m > 1) {
            m = 1;
        }
        this.addForce(new Vector(
            m * this.thrust * Math.cos(this.theta),
            m * this.thrust * Math.sin(this.theta)
        ));
    };

    Ship.prototype.turnRight = function(omega) {
        this.omega = this.agilityCheck(omega);
    };

    Ship.prototype.slowDown = function() {
    };

    Ship.prototype.seekPoint = function(dt) {
        var target = this.getFact('seekpoint');
        if (!target) {
            return;
        }
        // The seekpoint is a point on the screen, which can slide around as
        // the ship flies.
        var v = game.view.unproject(target);

        var heading = this.headingTo(v);
        if (heading < 0) {
            this.turnLeft(Math.abs(heading) * 50);
        } if (heading > 0) {
            this.turnRight(Math.abs(heading) * 50);
        }

        this.increaseThrust(heading ? 1 / heading : heading);
    };

    return Ship;
});

