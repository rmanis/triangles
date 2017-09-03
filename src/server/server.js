
require([
    'common/Constants',
    'server/Planets',
    'server/PlanetStomp',
], function(Constants, Planets, PlanetStomp) {

    var planets = new Planets();
    var stomp = new PlanetStomp(planets);

    var broadcastPlanetScheduled = function(planet) {

        var lastBroadcast = planet.lastBroadcast;
        var now = new Date();
        var diff = now - lastBroadcast;

        if (diff > Constants.planetBroadcastDelay) {
            stomp.broadcastPlanet(planet);
        }

        var delay = planet.lastBroadcast + Constants.planetBroadcastDelay - now;

        setTimeout(broadcastPlanetScheduled, delay, planet);
    };

    var planetAdded = function(planet) {

        broadcastPlanetScheduled(planet);
    };

    planets.initialize();
    stomp.initialize();
    debug('initialized');

    for (var planetId in planets.planets) {
        var planet = planets.planets[planetId];
        broadcastPlanetScheduled(planet);
    }

    return {
        planets: planets,
        stomp: stomp,
    };
});
