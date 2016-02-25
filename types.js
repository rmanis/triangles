
var KEY_LEFT = 37;
var KEY_UP = 38
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var epsilon = 0.000001;

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

var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.normalize = function() {
    var len = this.length();
    return new Vector(this.x / len, this.y / len);
}

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y;
}

Vector.prototype.subtract = function(b) {
    return new Vector(this.x - b.x, this.y - b.y);
}

Vector.prototype.scale = function(s) {
    return new Vector(this.x * s, this.y * s);
}

Vector.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
}

// Calculates the z component of the 2d cross product of
// this and vector v
Vector.prototype.zcross = function(v) {
    return this.x * v.y - this.y * v.x;
}

// Project this onto vector v
// a * ((a . b) / (|a| ** 2))
Vector.prototype.project = function(v) {
    var unit = v.normalize();
    var scaling = this.dot(v);
    return unit.scale(scaling);
}

// v.dot(w) = v.length * w.length * cos(angle)
Vector.prototype.angleTo = function(v) {
    var num = this.dot(v) / (this.length() * v.length());
    return Math.acos(num);
}

Vector.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

function vector(x, y) {
    return new Vector(x, y);
}

// Vector that represents a global heading of zero
var RIGHT_VEC = new Vector(1, 0);
