
define(['common/types/Ship',
    'common/types/Serialization',
    'common/types/Coordinate',
    'common/types/Vector',
], function(Ship, Serialization, Coordinate, Vector) {
    var stomp = Stomp;

    var Client = function(url, game) {
        this.client = url ?  Stomp.client(url) : null;
        this.game = game;
        this.lastPositionBroadcast = null;

        // The last time we sent out a broadcast
        this.lastBroadcastTime = 0;

        // Maximum time between broadcasting updates in milliseconds
        this.timeThreshold = 700;

        // Distance (squared) required to make a new broadcast
        this.distanceSquaredThreshold = 2500;

        // Channel data by topic type
        this.subscriptions = {
            // Positions:
            // Maps topic to stomp subscription object
            // e.g. { '/topic/position.+0+0' : subObj }
            position: {}
        };

        // How long we should keep track of received ships
        this.removalDelay = this.timeThreshold * 3;

        // The ship removal timeouts
        this.removalTimeouts = {};

        // Should we log subscribes and unsubscribes?
        this.debugSubs = false;
    };

    Client.prototype.onConnect = function(callback) {
        debug('onConnect called');
        var sub = this.client.subscribe('/topic/reload', function() {
            window.location.reload(false);
        }, {});
        if (callback) {
            callback();
        }
    };

    Client.prototype.onError = function(error) {
        debug('onError called ' + JSON.stringify(error, null, '  '));
        // Set a timeout to reconnect??
        // Fail after N tries??
    };

    Client.prototype.connect = function(login, callback) {
        if (!this.client) {
            return;
        }
        this.client.connect({
                login: login,
                passcode: 'triangles'
            },
            this.onConnect.bind(this, callback),
            this.onError.bind(this));
    };

    Client.prototype.positionReceived = function(message) {
        var shipId = message.headers.shipId;
        var planetId = message.headers.planetId;

        if (shipId) {
            this.shipReceived(message);
        } else if (planetId) {
            this.planetReceived(message);
        }
    };

    Client.prototype.shipReceived = function(message) {
        var ship;
        var id = message.headers.shipId;
        if (id !== this.game.selfId) {
            ship = this.game.getShip(id);
            if (ship) {
                var parsed = JSON.parse(message.body);

                for (var i in parsed) {
                    ship[i] = parsed[i];
                }
                ship.pos = new Coordinate(
                    new Vector(ship.pos.sec.x, ship.pos.sec.y),
                    new Vector(ship.pos.pos.x, ship.pos.pos.y));
            } else {
                ship = Serialization.deserializeShip(message.body);
                this.game.addShip(ship, id);
            }

            var removal = this.removalTimeouts[id];
            if (removal) {
                window.clearTimeout(removal);
            }
            // TODO: is there a better way to do this?
            //       Maybe keep a list of last updated times and check
            //       against now?
            var timeout = window.setTimeout(this.makeRemoval(id),
                    this.removalDelay);
            this.removalTimeouts[id] = timeout;
        }

        if (!id) {
            debug('Message received: ' + JSON.stringify(message, null, '  '));
        }
    };

    Client.prototype.planetReceived = function(message) {
        var planet;

        planet = Serialization.deserializePlanet(message.body);
        if (planet) {
            this.game.planets.addPlanet(planet);
        }
    };

    Client.prototype.makeRemoval = function(shipId) {
        var game = this.game;
        return function() {
            game.removeShip(shipId);
        };
    };

    Client.prototype.subscribe = function(topic, name, callback) {
        if (this.subscriptions[name]) {
            this.subscriptions[name].push(this.client.subscribe(topic, callback, {}));
        } else {
            this.subscriptions[name] = [
                this.client.subscribe(topic, callback, {})
            ];
        }
    };

    Client.prototype.send = function(destination, headers, body) {
        if (this.client.connected) {
            this.client.send(destination, headers, body);
        }
    };

    // TODO: consider pulling out position subscription

    // Subscribe to a position topic, storing the subscription data.
    Client.prototype.subscribePosition = function(topic, callback) {
        if (this.client.connected) {
            var sub = this.subscriptions.position[topic];
            if (sub) {
                sub.unsubscribe();
            }
            if (this.debugSubs) {
                debug('subscribing to ' + topic);
            }
            sub = this.client.subscribe(topic, callback, {});
            this.subscriptions.position[topic] = sub;
        }
    };

    Client.prototype.unsubscribePosition = function(topic) {
        var subdata = this.subscriptions.position[topic];
        if (subdata) {
            if (this.debugSubs) {
                debug('unsubscribing from ' + topic);
            }
            subdata.unsubscribe();
            delete this.subscriptions.position[topic];
        }
    };

    Client.prototype.updatePosition = function(now, player_ship) {
        // Check subscriptions, update when sector changes
        this.checkSubscriptions(player_ship);
        // Decide whether to broadcast update
        var shouldBroadcast = !this.lastPositionBroadcast;
        if (this.lastPositionBroadcast) {
            var dp = player_ship.pos.subtract(this.lastPositionBroadcast.pos);
            shouldBroadcast = shouldBroadcast ||
                (dp.lengthSquared() > this.distanceSquaredThreshold) ||
                (now - this.lastBroadcastTime > this.timeThreshold);

        }
        if (shouldBroadcast) {
            this.broadcastPosition(now, player_ship);
        }
    };

    Client.prototype.setLastPositionBroadcast = function(ship) {
        this.lastPositionBroadcast = new Ship(ship);
    };

    Client.prototype.broadcastPosition = function(now, ship) {
        if (!this.client.connected) {
            return;
        }
        this.lastBroadcastTime = now;
        var topic = this.getPositionTopic(ship);
        var headers = {
            shipId: this.game.selfId
        };
        this.setLastPositionBroadcast(ship);
        var data = Serialization.serializeShip(ship);
        this.client.send(topic, headers, data);
    };

    Client.prototype.topicForXY = function(prefix, x, y) {
        var xComp = (x < 0 ? "" : "_") + x;
        var yComp = (y < 0 ? "" : "_") + y;
        return prefix + xComp + yComp;
    };

    Client.prototype.topicForCoordinate = function(prefix, coord) {
        return prefix + coord.toTopicSubString();
    };

    Client.prototype.getPositionTopic = function(ship) {
        return this.topicForCoordinate(Client.positionTopicPrefix, ship.pos);
    };

    Client.prototype.positionTopicForSector = function(x, y) {
        return this.topicForXY(Client.positionTopicPrefix, x, y);
    };

    Client.prototype.planetTopicForSector = function(x, y) {
        return this.topicForXY(Client.planetTopicPrefix, x, y);
    };

    Client.prototype.subscribeSectorsExclusive = function(sectorTopics) {
        var topic;
        var i;
        for (topic in this.subscriptions.position) {
            if (sectorTopics.indexOf(topic) < 0) {
                this.unsubscribePosition(topic);
            }
        }
        for (i in sectorTopics) {
            topic = sectorTopics[i];
            if (!this.subscriptions.position[topic]) {
                var callback = this.positionReceived.bind(this);
                this.subscribePosition(topic, callback);
            }
        }
    };

    Client.prototype.checkSubscriptions = function(ship) {
        // Compare the ship's position with the list of topics we are
        // subscribed to.
        var x = ship.pos.sec.x;
        var y = ship.pos.sec.y;
        var i, j;
        var subs = [];
        var key;

        for (i = x - 1; i <= x + 1; i++) {
            for (j = y - 1; j <= y + 1; j++) {
                subs.push(this.positionTopicForSector(i, j));
            }
        }

        this.subscribeSectorsExclusive(subs);
    };

    Client.prototype.isConnected = function() {
        return this.client.connected;
    };

    Client.prototype.debug = function(text) {
        if (this.client.connected) {
            this.client.send('/topic/debug', {}, text);
        }
    };

    Client.positionTopicPrefix = '/topic/position.';
    Client.planetTopicPrefix = '/topic/position.';

    return Client;
});
