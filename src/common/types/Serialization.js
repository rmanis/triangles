
define(['common/types/Ship'], function(Ship) {
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
            var attributes = ['id', 'coord'];
            return Serialization.serializeAttributes(planet, attributes);
        }
    };

    return Serialization;
});
