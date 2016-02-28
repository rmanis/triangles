
var Ship = function(attr) {

    this.pos = new Vector();
    this.vx = 0;
    this.vy = 0;

    this.size = 10;
    this.mass = 1;

    this.theta = 0;
    this.omega = 0;

    this.mu = 0.05;

    this.thrust = 25;
    this.agility = Math.PI * 2;

    this.forces = [];

    // Precursor to components
    this.tickers = [];

    this.facts = {};

    Object.defineProperty(this, 'x', {
        get: function() { return this.pos.x; },
        set: function(x) { this.pos.x = x; },
    });
    Object.defineProperty(this, 'y', {
        get: function() { return this.pos.y; },
        set: function(y) { this.pos.y = y; },
    });

    for (var k in attr) {
        if (this.hasOwnProperty(k)) {
            this[k] = attr[k];
        }
    }
};

Ship.prototype.update = function(dt) {
    for (var t in this.tickers) {
        var ticker = this.tickers[t];
        ticker(dt);
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

Ship.prototype.addTicker = function(ticker) {
    this.tickers.push(ticker);
};

Ship.prototype.removeTicker = function(ticker) {
    var i = this.tickers.indexOf(ticker);
    if (i >= 0) {
        this.tickers.splice(i, 1);
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
    this.addForce(vector(
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
    var v = unproject(game, target);

    var heading = this.headingTo(v);
    if (heading < 0) {
        this.turnLeft(Math.abs(heading) * 50);
    } if (heading > 0) {
        this.turnRight(Math.abs(heading) * 50);
    }

    this.increaseThrust(heading ? 1 / heading : heading);
};

