
define([
    'common/types/Coordinate'
], function(Coordinate) {

    var Planet = function(id, coordinate, radius, mass) {
        this.id = id;
        this.coord = new Coordinate(coordinate.sec, coordinate.pos);
        this.radius = radius;
        this.mass = mass;
        this.lastBroadcast = new Date(0);
    };

    Planet.prototype.update = function(data) {
        var updated = false;

        if (!this.coord.equals(data.coord)) {
            this.coord.sec.x = data.sec.x;
            this.coord.sec.y = data.sec.y;
            this.coord.pos.x = data.pos.x;
            this.coord.pos.y = data.pos.y;
            updated = true;
        }
        if (this.radius != data.radius) {
            this.radius = data.radius;
            updated = true;
        }
        if (this.mass != data.mass) {
            this.mass = data.mass;
            updated = true;
        }
        return updated;
    };

    return Planet;
});
