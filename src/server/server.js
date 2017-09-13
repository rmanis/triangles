
require([
    'common/Constants',
    'common/types/Planets',
    'server/PeriodicBroadcaster',
    'server/PlanetStomp',
], function(Constants, Planets, PeriodicBroadcaster, PlanetStomp) {

    var planets = new Planets();
    var stomp = new PlanetStomp(planets);
    var broadcaster = new PeriodicBroadcaster(planets, stomp);

    planets.initialize();
    stomp.initialize();
    stomp.connect();
    broadcaster.initialize();
    debug('initialized');

    return {
        planets     : planets,
        stomp       : stomp,
        broadcaster : broadcaster,
    };
});
