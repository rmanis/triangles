
define([
    'common/types/Ship',
    'common/types/Planet',
], function(Ship, Planet) {
    var Serialization = {

        serializeAttributes : function(object, attributes) {
            var data = {};
            var i;
            for (i in attributes) {
                var key = attributes[i];
                data[key] = object[key];
            }
            return JSON.stringify(data);
        },

        serializeShip : function(ship) {
            var attributes = ['pos','vx','vy','theta','omega'];
            return Serialization.serializeAttributes(ship, attributes);
        },

        deserializeShip : function(text) {
            var data = JSON.parse(text);
            return new Ship(data);
        },

        serializePlanet : function(planet) {
            var attributes = ['id', 'coord', 'radius', 'mass'];
            return Serialization.serializeAttributes(planet, attributes);
        },

        deserializePlanet : function(text) {
            var data = JSON.parse(text);
            return new Planet(data.id, data.coord, data.radius, data.mass);
        }
    };

    return Serialization;
});
