
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

    return Coordinate;
});
