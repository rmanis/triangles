
define([
    'common/Constants',
    'common/types/Vector'
], function(Constants, Vector) {

    var Coordinate = function(sectorVector, positionVector) {
        if (sectorVector) {
            this.sec = sectorVector;
        } else {
            this.sec = new Vector();
        }
        if (positionVector) {
            this.pos = positionVector;
        } else {
            this.pos = new Vector();
        }
    };

    // Adding a vector to a coordinate
    Coordinate.prototype.add = function(v) {
        var newCoord = new Coordinate(
            new Vector(this.sec.x, this.sec.y),
            this.pos.add(v));
        return newCoord;
    };

    // Returns the vector from coord to this
    //
    // +----+----+----+----+
    // |    |    |    |.   |
    // | .  |    |    |    |
    // +----+----+----+----+
    // x            x+3
    //   ^             ^
    //
    Coordinate.prototype.subtract = function(coord) {
        var size = Constants.sectorSize;
        var sdx = this.sec.x - coord.sec.x;
        var dx = (sdx * size) + (this.pos.x - coord.pos.x);

        var sdy = this.sec.y - coord.sec.y;
        var dy = sdy * size + (this.pos.y - coord.pos.y);

        var result = new Vector(dx, dy);
        return result;
    };

    Coordinate.prototype.distanceSquared = function(coord) {
        return this.subtract(coord).lengthSquared();
    };

    // Adjusts the coordinate's vectors' components such that the
    // point is a sane place within a sector, i.e. vector components
    // satisfy (0 <= [xy] < sectorSize)
    Coordinate.prototype.normalize = function() {
        var max = Constants.sectorSize;
        var vec = this.pos;

        this.sec.x += Math.floor(vec.x / max);
        this.sec.y += Math.floor(vec.y / max);
        this.pos.x = ((this.pos.x % max) + max) % max;
        this.pos.y = ((this.pos.y % max) + max) % max;

        return this;
    };

    Coordinate.prototype.toString = function() {
        return '(' + this.sec + ',' + this.pos + ')';
    };

    Coordinate.prototype.toTopicSubString = function() {
        var xprefix = this.sec.x < 0 ? "" : "_";
        var yprefix = this.sec.y < 0 ? "" : "_";
        return xprefix + this.sec.x + yprefix + this.sec.y;
    };

    Coordinate.toTopicSubStringXY = function(x, y) {
        var xprefix = x < 0 ? "" : "_";
        var yprefix = y < 0 ? "" : "_";
        return xprefix + x + yprefix + y;
    };

    return Coordinate;
});
