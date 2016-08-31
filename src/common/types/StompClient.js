
define(['common/types/Ship',
    'common/types/Serialization',
], function(Ship, Serialization) {
    var stomp = Stomp;

    var Client = function(url, game) {
        this.client = url ?  Stomp.client(url) : null;
        this.game = game;
        this.lastData = null;

        // The last time we sent out a broadcast
        this.lastBroadcastTime = 0;

        // Maximum time between broadcasting updates in milliseconds
        this.timeThreshold = 3000;

        // Distance (squared) required to make a new broadcast
        this.distanceSquaredThreshold = 2500;

        // Channel data by topic type
        this.subscriptions = {
            // Positions:
            // Maps topic to stomp subscription object
            // e.g. { '/topic/position.+0+0' : subObj }
            position: {}
        };
    };

    Client.prototype.onConnect = function() {
        debug('onConnect called');
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
        debug('Message received: ' + JSON.stringify(message, null, '  '));
    };

    // Subscribe to a position topic, storing the subscription data.
    Client.prototype.subscribePosition = function(topic, callback) {
        var sub = this.subscriptions.position[topic];
        if (sub) {
            sub.unsubscribe();
        }
        debug('subscribing to ' + topic);
        sub = this.client.subscribe(topic, callback, {});
        this.subscriptions.position[topic] = sub;
    };

    Client.prototype.unsubscribePosition = function(topic) {
        var subdata = this.subscriptions.position[topic];
        if (subdata) {
            subdata.unsubscribe();
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
        // TODO: Base this on the ship's location's sector
        // I guess use _ for positive, - for negative
        return '/topic/position._0_0';
    };

    Client.prototype.checkSubscriptions = function(ship) {
        // Compare the ship's position with the list of topics we are
        // subscribed to.
        // TODO: Get subscribe to surrounding sectors
        // TODO: Make this useful
        if (!this.subscribed && this.client.connected) {
            var topic = this.getPositionTopic(ship);
            var callback = this.positionReceived.bind(this);
            this.subscribePosition(topic, callback);
            // TODO: not this.
            this.subscribed = true;
        }
    };

    return Client;
});
