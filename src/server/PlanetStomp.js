
define([
    'common/types/Serialization',
    'common/types/Vector',
    'common/types/Coordinate',
    'common/types/Planet',
    'common/types/GenericStomp',
], function(Serialization, Vector, Coordinate, Planet, StompClient) {

    var PlanetStomp = function(planets) {
        StompClient.call(this);

        this.planets = planets;
        this.ships = {};
    };
    PlanetStomp.prototype = Object.create(StompClient.prototype);
    PlanetStomp.prototype.constructor = PlanetStomp;

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
        StompClient.prototype.initialize.call(this);
        this.planets.interest(this);
    };

    PlanetStomp.prototype.connect = function() {
        StompClient.prototype.connect.call(this, 'planets');
    };

    PlanetStomp.prototype.onConnect = function() {
        for (var p in this.planets.positionToPlanetArray) {
            var topic = StompClient.positionTopicPrefix + p;
            this.subscribe(topic, this.shipReceived.bind(this));
        }

        this.subscribe(StompClient.planetRequestTopic, this.requestReceived.bind(this));
        this.subscribe(StompClient.planetUpdateTopic, this.planetUpdated.bind(this));
    };

    PlanetStomp.prototype.broadcastPlanet = function(planet) {
        if (this.isConnected()) {
            var destination = StompClient.planetTopicPrefix + planet.coord.toTopicSubString();
            var headers = {
                planetId : planet.id,
            };
            var body = Serialization.serializePlanet(planet);
            this.send(destination, headers, body);
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
            this.send(destination, headers, Serialization.serializePlanet(p));
        }
    };

    PlanetStomp.prototype.subscribePlanetSector = function(planet) {
        var suffix = planet.coord.toTopicSubString();
        var topic = StompClient.positionTopicPrefix + suffix;
        this.subscribe(topic, this.shipReceived.bind(this));
    };

    PlanetStomp.prototype.planetAdded = function(planetId) {
        var planet = this.planets.get(planetId);
        if (planet) {
            this.subscribePlanetSector(planet);
        }
    };

    PlanetStomp.prototype.planetUpdated = function(msg) {
        var data = JSON.parse(msg.body);
        if (data.action === 'delete') {
            var id = data.id;
            this.planets.deletePlanet(id);
        } else if (data.action === 'update') {
            var p = Planet.fromAttributes(data.planet);
            this.planets.addPlanet(p);
        }
    };

    PlanetStomp.prototype.planetDeleted = function(planet) {
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
