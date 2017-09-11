
define([], function() {
    var Vector = function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 1;
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

    Vector.prototype.add = function(b) {
        return new Vector(this.x + b.x, this.y + b.y);
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

    Vector.prototype.equals = function(v) {
        return v && this.x == v.x && this.y == v.y;
    };

    Vector.prototype.toTopicSubString = function() {
        var xprefix = this.x < 0 ? "" : "_";
        var yprefix = this.y < 0 ? "" : "_";
        return xprefix + this.x + yprefix + this.y;
    };

    Vector.prototype.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    };

    // Vector that represents a global heading of zero
    var RIGHT_VEC = new Vector(1, 0);
    return Vector;
});
