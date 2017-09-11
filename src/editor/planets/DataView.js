
define([
], function() {

    var DataView = function(element, planets) {
        this.element = element;
        this.planets = planets;
    };

    DataView.prototype.initialize = function() {
        this.planets.interest(this);
        this.update();
    };

    DataView.prototype.update = function() {
        var data = [];
        for (var id in this.planets.planets) {
            var planet = this.planets.planets[id];
            data.push([
                planet.id,
                planet.coord.sec.x, planet.coord.sec.y,
                planet.coord.pos.x, planet.coord.pos.y,
                planet.radius, planet.mass
            ]);
        }
        this.element.value = JSON.stringify(data);
    };

    DataView.prototype.planetAdded = function(planet) {
        this.update();
    };

    DataView.prototype.planetUpdated = function(planet) {
        this.update();
    };

    DataView.prototype.planetDeleted = function(planet) {
        this.update();
    };

    return DataView;
});
