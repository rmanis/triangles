
define(['common/types/Ship',
    'common/types/Serialization',
    'common/types/Coordinate',
    'common/types/Vector',
], function(Ship, Serialization, Coordinate, Vector) {
    var stomp = Stomp;

    var Client = function(url, game) {
        this.client = url ?  Stomp.client(url) : null;
        this.game = game;
        this.lastData = null;

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

    Client.prototype.onConnect = function() {
        debug('onConnect called');
        var sub = this.client.subscribe('/topic/reload', function() {
            window.location.reload(false);
        }, {});
    };

    Client.prototype.onError = function(error) {
        debug('onError called ' + JSON.stringify(error, null, '  '));
        // Set a timeout to reconnect??
        // Fail after N tries??
    };

    Client.prototype.connect = function() {
        if (!this.client) {
            return;
        }
        this.client.connect({
                login: this.game.selfId,
                passcode: 'triangles'
            },
            this.onConnect.bind(this),
            this.onError.bind(this));
    };

    Client.prototype.positionReceived = function(message) {
        var id = message.headers.shipId;
        var ship;
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

    Client.prototype.makeRemoval = function(shipId) {
        var game = this.game;
        return function() {
            game.removeShip(shipId);
        };
    };

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
        var shouldBroadcast = !this.lastData;
        if (this.lastData) {
            var dp = player_ship.pos.subtract(this.lastData.pos);
            shouldBroadcast = shouldBroadcast ||
                (dp.lengthSquared() > this.distanceSquaredThreshold) ||
                (now - this.lastBroadcastTime > this.timeThreshold);

        }
        if (shouldBroadcast) {
            this.broadcastPosition(now, player_ship);
        }
    };

    Client.prototype.setLastData = function(ship) {
        this.lastData = new Ship(ship);
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
        this.setLastData(ship);
        var data = Serialization.serializeShip(ship);
        this.client.send(topic, headers, data);
    };

    Client.prototype.getPositionTopic = function(ship) {
        return this.topicForSector(ship.pos.sec.x, ship.pos.sec.y);
    };

    Client.prototype.topicForSector = function(x, y) {
        var xComp = (x < 0 ? "" : "_") + x;
        var yComp = (y < 0 ? "" : "_") + y;
        return "/topic/position." + xComp + yComp;
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
                subs.push(this.topicForSector(i, j));
            }
        }

        this.subscribeSectorsExclusive(subs);
    };

    Client.prototype.debug = function(text) {
        if (this.client.connected) {
            this.client.send('/topic/debug', {}, text);
        }
    };

    return Client;
});
