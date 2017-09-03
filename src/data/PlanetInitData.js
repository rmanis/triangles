
define([
    'common/types/Vector',
    'common/types/Coordinate',
    'common/types/Planet',
], function(Vector, Coordinate, Planet) {
    var coords = [
        // coord(sector, position)
        // coord(vec(e[0],e[1]), vec(e[2], e[3]))
        ["5d1e118c-8e6f-461c-b8f0-1eff4e7b87f3", 0,0,  300, 300],
        ["7dd3f2a9-8a80-4726-8a00-aad82e573be7", 1,0,  300, 300],
        ["724e0bf5-9042-49bd-57eb-6c3c36539d13", 0,1,  300, 300],
        ["04119517-7a03-4637-b844-411778128a3e", 1,1,  300, 300],
        ["dc1deffc-fad6-45a6-023a-c4b55ded93fb", -1,-1,  300, 300],
        ["c8a596d4-6b38-49e4-1ac4-114106722712", -1,0,  300, 300],
        ["4b8511ef-ddb5-474a-08ab-8c1179caf88e", 0,-1,  300, 300],
        ["37fc6eeb-0a29-4cad-ab8a-53e61683d5e8", 1, -1, 300, 300],
        ["09dc0958-4e22-4898-a462-39d07e1651b2", -1, 1, 300, 300],
    ];
    var planetData = [];

    for (var i in coords) {
        var data = coords[i];
        planetData[data[0]] = new Planet(
            data[0],
            new Coordinate(
                new Vector(data[1], data[2]),
                new Vector(data[3], data[4])));
    }

    return planetData;
});
