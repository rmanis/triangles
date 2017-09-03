
define([
    'common/types/Coordinate'
], function(Coordinate) {

    var Planet = function(id, coordinate) {
        this.id = id;
        this.coord = new Coordinate(coordinate.sec, coordinate.pos);
        this.lastBroadcast = new Date(0);
    };

    return Planet;
});
