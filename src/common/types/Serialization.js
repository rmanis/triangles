
define([], function() {
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
        }
    };

    return Serialization;
});
