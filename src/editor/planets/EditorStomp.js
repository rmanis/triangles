
define([
    'common/types/GenericStomp',
    'common/types/Serialization',
], function(StompClient, Serialization) {

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
        console.log(obj);
        this.planets.addPlanet(planet);
    };

    return EditorStomp;
});
