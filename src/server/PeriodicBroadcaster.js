
define([
    'common/Constants',
], function(Constants) {
    var PeriodicBroadcaster = function(planets, stomp) {
        this.planets = planets;
        this.stomp = stomp;
        this.timeouts = {};
    };

    PeriodicBroadcaster.prototype.initialize = function() {
        this.stomp.interest(this);
        this.planets.interest(this);
        for (var planetId in this.planets.planets) {
            var planet = this.planets.planets[planetId];
            this.broadcastPlanetScheduled(planet);
        }
    };

    PeriodicBroadcaster.prototype.broadcastPlanetScheduled = function(planet) {

        var lastBroadcast = planet.lastBroadcast;
        var now = new Date();
        var diff = now - lastBroadcast;

        if (diff > Constants.planetBroadcastDelay) {
            this.stomp.broadcastPlanet(planet);
        }

        var delay = planet.lastBroadcast + Constants.planetBroadcastDelay - now;

        this.timeouts[planet.id] = setTimeout(this.broadcastPlanetScheduled.bind(this), delay, planet);
    };

    PeriodicBroadcaster.prototype.planetAdded = function(planetId) {
        var planet = this.planets.get(planetId);
        this.broadcastPlanetScheduled(planet);
    };

    PeriodicBroadcaster.prototype.planetUpdated = function(planetId) {
        var planet = this.planets.get(planetId);
        this.broadcastPlanetScheduled(planet);
    };

    PeriodicBroadcaster.prototype.planetDeleted = function(planet) {
        var timeout = this.timeouts[planet.id];
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    PeriodicBroadcaster.prototype.onConnect = function() {
        // Start timeouts?
    };

    PeriodicBroadcaster.prototype.onError = function(e) {
        // Stop timeouts
    };

    PeriodicBroadcaster.prototype.onDisconnect = function() {
        // Stop timeouts
    };

    return PeriodicBroadcaster;
});
