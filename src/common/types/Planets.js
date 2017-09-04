
define([
    'data/PlanetInitData',
    'common/types/Coordinate',
], function(initData, Coordinate) {

    var Planets = function() {
        // {
        //  "_0_0" : {
        //      "uuid" : planet(),
        //      ...
        //  },
        //  ...
        // }
        this.positionToPlanetArray = {};
        this.planets = {};
        this.listeners = [];
    };

    Planets.prototype.initialize = function(overrideData) {
        useData = overrideData;
        if (!useData) {
            useData = initData;
        }
        this.parseInitData(useData, this.positionToPlanetArray);
    };

    Planets.prototype.parseInitData = function(data, db) {
        for (var i in data) {

            var planet = data[i];
            this.addPlanet(planet);
        }
    };

    Planets.prototype.interest = function(listener) {
        this.listeners.push(listener);
    };

    Planets.prototype.planetsInSector = function(x, y) {
        return this.positionToPlanetArray[Coordinate.toTopicSubStringXY(x, y)];
    };
    };

    Planets.prototype.addPlanet = function(planet) {

        if (!this.planets[planet.id]) {
            var key = planet.coord.toTopicSubString();
            var planetsInSector = this.positionToPlanetArray[key];

            if (!planetsInSector) {
                this.positionToPlanetArray[key] = {};
                planetsInSector = this.positionToPlanetArray[key];
            }

            planetsInSector[planet.id] = planet;

            this.planets[planet.id] = planet;
            this.listeners.map(function(l) {
                l.planetAdded();
            });
        } else {
            var oldPlanet = this.planets[planet.id];
            oldPlanet.update(planet);
            this.listeners.map(function(l) {
                l.planetUpdated(planet.id);
            });
        }

    };

    return Planets;
});
