
define([
    'common/types/Ship',
    'common/types/Planet',
], function(Ship, Planet) {
    var Serialization = {

        serializeable : function(object, attributes) {
            var data = {};
            var i;
            for (i in attributes) {
                var key = attributes[i];
                data[key] = object[key];
            }
            return data;
        },

        serializeAttributes : function(object, attributes) {
            var data = Serialization.serializeable(object, attributes);
            return JSON.stringify(data);
        },

        shipAttributes : ['pos','vx','vy','theta','omega'],
        serializeShip : function(ship) {
            return Serialization.serializeAttributes(ship,
                Serialization.shipAttributes);
        },

        deserializeShip : function(text) {
            var data = JSON.parse(text);
            return new Ship(data);
        },

        planetAttributes : ['id', 'coord', 'radius', 'mass'],
        serializePlanet : function(planet) {
            return Serialization.serializeAttributes(planet,
                Serialization.planetAttributes);
        },

        deserializePlanet : function(text) {
            var data = JSON.parse(text);
            return new Planet(data.id, data.coord, data.radius, data.mass);
        }
    };

    return Serialization;
});
