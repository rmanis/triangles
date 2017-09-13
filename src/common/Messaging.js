
define([
    'common/types/Serialization'
], function(Serialization) {

    var Messaging = {
        planetUpdate : function(p) {
            var body = {
                action : 'update',
                id     : p.id,
                planet : Serialization.serializeable(p,
                    Serialization.planetAttributes)
            };
            return JSON.stringify(body);
        },

        planetDelete : function(p) {
            var body = {
                action : 'delete',
                id     : p.id,
                planet : Serialization.serializeable(p,
                    Serialization.planetAttributes)
            };
            return JSON.stringify(body);
        },
    };

    return Messaging;
});
