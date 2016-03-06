
var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.normalize = function() {
    var len = this.length();
    return new Vector(this.x / len, this.y / len);
};

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y;
};

Vector.prototype.subtract = function(b) {
    return new Vector(this.x - b.x, this.y - b.y);
};

Vector.prototype.scale = function(s) {
    return new Vector(this.x * s, this.y * s);
};

Vector.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

// Calculates the z component of the 2d cross product of
// this and vector v
Vector.prototype.zcross = function(v) {
    return this.x * v.y - this.y * v.x;
};

// Project this onto vector v
// a * ((a . b) / (|a| ** 2))
Vector.prototype.project = function(v) {
    var unit = v.normalize();
    var scaling = this.dot(v);
    return unit.scale(scaling);
};

// v.dot(w) = v.length * w.length * cos(angle)
Vector.prototype.angleTo = function(v) {
    var num = this.dot(v) / (this.length() * v.length());
    return Math.acos(num);
};

Vector.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
};

// Vector that represents a global heading of zero
var RIGHT_VEC = new Vector(1, 0);
