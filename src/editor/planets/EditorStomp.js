
define([
    'common/Messaging',
    'common/types/GenericStomp',
    'common/types/Serialization',
], function(Messaging, StompClient, Serialization) {

    var EditorStomp = function(planets) {
        StompClient.call(this);

        this.client = null;
        this.planets = planets;
    };

    EditorStomp.prototype = Object.create(StompClient.prototype);
    EditorStomp.prototype.constructor = EditorStomp;

    EditorStomp.prototype.connect = function() {
        StompClient.prototype.connect.call(this, 'editor');
    };

    EditorStomp.prototype.onConnect = function() {
        StompClient.prototype.onConnect.call(this);
        this.client.subscribe(StompClient.planetResponseQueue, this.planetReceived.bind(this));
        this.sendPlanetRequest();
    };

    EditorStomp.prototype.sendPlanetRequest = function() {
        var destination = StompClient.planetRequestTopic;
        var headers = {
            "reply-to" : StompClient.planetResponseQueue,
        };
        var body = JSON.stringify({
        });
        this.client.send(destination, headers, body);
    };

    EditorStomp.prototype.planetReceived = function(msg) {
        var planet = Serialization.deserializePlanet(msg.body);
        var obj = JSON.parse(msg.body);
        this.planets.addPlanet(planet);
    };

    EditorStomp.prototype.sendPlanetUpdate = function(id) {
        var planet = this.planets.get(id);
        if (planet) {
            var body = Messaging.planetUpdate(planet);
            this.client.send(StompClient.planetUpdateTopic, {}, body);
        }
    };

    EditorStomp.prototype.sendPlanetDelete = function(id) {
        var planet = this.planets.get(id);
        if (planet) {
            var body = Messaging.planetDelete(planet);
            this.client.send(StompClient.planetUpdateTopic, {}, body);
        }
    };

    return EditorStomp;
});
