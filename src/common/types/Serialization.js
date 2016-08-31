
define(['common/types/Ship'], function(Ship) {
    var Serialization = {
        serializeShip : function(ship) {
            var attributes = ['x','y','vx','vy','theta','omega'];
            var data = {};
            var i;
            for (i in attributes) {
                var key = attributes[i];
                data[key] = ship[key];
            }
            return JSON.stringify(data);
        },

        deserializeShip : function(text) {
            var data = JSON.parse(text);
            return new Ship(data);
        }
    };

    return Serialization;
});
