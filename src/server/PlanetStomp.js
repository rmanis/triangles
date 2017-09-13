
define([
    'common/types/Serialization',
    'common/types/Vector',
    'common/types/Coordinate',
    'common/types/StompClient',
], function(Serialization, Vector, Coordinate, StompClient) {

    var PlanetStomp = function(planets) {

        this.planets = planets;
        this.stomp = null;
        this.ships = {};
        this.positionTopicPrefix = StompClient.positionTopicPrefix;
    };

    var ShipRecord = function(id, ship) {
        this.shipId = id;
        this.ship = ship;
        this.lastUpdated = new Date();
    };

    var PlanetRecord = function(id, planet) {
        this.id = id;
        this.planet = planet;
        this.lastBroadcast = new Date();
    };

    PlanetStomp.prototype.initialize = function() {

        var url;
        if (typeof window !== undefined) {
            url = 'ws://' + window.location.hostname + ':61623';
            this.stomp = new StompClient(url, this);
        } else {
            this.stomp = new StompClient('ws://localhost:61623', this);
        }

        if (this.stomp) {
            this.stomp.connect('planets', this.onConnect.bind(this));
        }
    };

    PlanetStomp.prototype.onConnect = function() {
        for (var p in this.planets.positionToPlanetArray) {
            var topic = this.positionTopicPrefix + p;
            this.subscribe(topic, this.shipReceived.bind(this));
        }

        this.subscribe(StompClient.planetRequestTopic, this.requestReceived.bind(this));
    };

    PlanetStomp.prototype.subscribe = function(topic, callback) {
        this.stomp.subscribe(topic, 'ShipForPlanets', callback);
    };

    PlanetStomp.prototype.broadcastPlanet = function(planet) {
        if (this.stomp.isConnected()) {
            var destination = StompClient.planetTopicPrefix + planet.coord.toTopicSubString();
            var headers = {
                planetId : planet.id,
            };
            var body = Serialization.serializePlanet(planet);
            this.stomp.send(destination, headers, body);
            planet.lastBroadcast = new Date();
        }
    };

    PlanetStomp.prototype.shipReceived = function(message) {
        var id = message.headers.shipId;
        if (!id) {
            return;
        }

        var shipRecord = this.ships[id];
        var ship;

        if (shipRecord) {
            ship = shipRecord.ship;

            var parsed = JSON.parse(message.body);
            var oldSec = ship.pos.sec;

            for (var i in parsed) {
                ship[i] = parsed[i];
            }
            ship.pos = new Coordinate(
                new Vector(ship.pos.sec.x, ship.pos.sec.y),
                new Vector(ship.pos.pos.x, ship.pos.pos.y));
            shipRecord.lastUpdated = new Date();

            if (!oldSec.equals(ship.pos.sec)) {
                this.informShip(ship);
            }
        } else {
            ship = Serialization.deserializeShip(message.body);
            this.addShip(id, ship);
            this.informShip(ship);
        }
    };

    PlanetStomp.prototype.requestReceived = function(msg) {

        var destination = msg.headers['reply-to'];

        for (var i in this.planets.planets) {
            var p = this.planets.planets[i];
            var headers = { planetId : p.id };
            this.stomp.send(destination, headers, Serialization.serializePlanet(p));
        }
    };

    PlanetStomp.prototype.addShip = function(id, ship) {
        this.ships[id] = new ShipRecord(id, ship);
    };

    PlanetStomp.prototype.informShip = function(ship) {
        var sector = ship.pos.sec;
        var planetsInSector = this.planets.planetsInSector(sector.x, sector.y);
        for (var id in planetsInSector) {
            this.broadcastPlanet(planetsInSector[id]);
        }
    };

    return PlanetStomp;
});
