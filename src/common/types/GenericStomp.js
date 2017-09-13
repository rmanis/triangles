
define([
], function() {

    var GenericStomp = function() {

        this.client = null;

        this.connectListeners = [];
        this.errorListeners = [];
        this.disconnectListeners = [];
    };

    GenericStomp.prototype.initialize = function() {
        // this.connect();
    };

    GenericStomp.prototype.connect = function(login) {
        // Apparently you can't let it sit too long before connecting.
        if (typeof window !== undefined) {
            url = 'ws://' + window.location.hostname + ':61623';
            this.client = Stomp.client(url);
        } else {
            this.client = Stomp.client('ws://localhost:61623');
        }
        this.client.connect({
                login:    login,
                passcode: 'triangles',
            },
            this.onConnect.bind(this),
            this.onError.bind(this));
    };

    GenericStomp.prototype.disconnect = function() {
        if (this.client) {
            this.client.disconnect(this.onDisconnect.bind(this));
        }
    };

    GenericStomp.prototype.isConnected = function() {
        return this.client && this.client.connected;
    };

    GenericStomp.prototype.onConnect = function() {
        for (var i in this.connectListeners) {
            this.connectListeners[i].onConnect();
        }
    };

    GenericStomp.prototype.onError = function(e) {
        for (var i in this.errorListeners) {
            this.errorListeners[i].onError(e);
        }
    };

    GenericStomp.prototype.onDisconnect = function(e) {
        for (var i in this.disconnectListeners) {
            this.errorListeners[i].onError(e);
        }
    };

    GenericStomp.prototype.subscribe = function(topic, callback) {
        this.client.subscribe(topic, callback);
    };

    GenericStomp.prototype.send = function(destination, headers, body) {
        this.client.send(destination, headers, body);
    };

    GenericStomp.prototype.addOnConnect = function(l) {
        this.connectListeners.push(l);
    };

    GenericStomp.prototype.addOnError = function(l) {
        this.errorListeners.push(l);
    };

    GenericStomp.prototype.addOnDisconnect = function(l) {
        this.disconnectListeners.push(l);
    };

    GenericStomp.prototype.interest = function(l) {
        this.addOnConnect(l);
        this.addOnError(l);
        this.addOnDisconnect(l);
    };

    GenericStomp.positionTopicPrefix = '/topic/position.';
    GenericStomp.planetTopicPrefix   = '/topic/position.';
    GenericStomp.planetUpdateTopic   = '/topic/planets.update';
    GenericStomp.planetRequestTopic  = '/topic/planets.request';
    GenericStomp.planetResponseQueue = '/temp-queue/planets.response';

    return GenericStomp;
});
