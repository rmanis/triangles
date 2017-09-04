
define([
    'common/types/Vector',
    'common/types/Coordinate',
    'common/types/Planet',
], function(Vector, Coordinate, Planet) {
    var coords = [
        // coord(sector, position)
        // coordinate : coord(vec(e[1],e[2]), vec(e[3], e[4]))
        // radius : e[5]
        // mass : e[6]

        //                                   id, sx, sy,   px,  py,  rad, mass
        ["b9ba430e-b7c6-4bee-2fda-561535412040",  0,  0,   50,  89,   40,   64],
        ["5d1e118c-8e6f-461c-b8f0-1eff4e7b87f3",  0,  0,  650, 589,   54,   64],
        ["7dd3f2a9-8a80-4726-8a00-aad82e573be7",  1,  0,  393, 461,   78,   87],
        ["724e0bf5-9042-49bd-57eb-6c3c36539d13",  0,  1,  593, 536,   57,   50],
        ["04119517-7a03-4637-b844-411778128a3e",  1,  1,  348, 534,   52,   46],
        ["dc1deffc-fad6-45a6-023a-c4b55ded93fb", -1, -1,  666, 302,   59,   64],
        ["c8a596d4-6b38-49e4-1ac4-114106722712", -1,  0,  365, 648,   79,   74],
        ["4b8511ef-ddb5-474a-08ab-8c1179caf88e",  0, -1,  394, 325,   69,   82],
        ["37fc6eeb-0a29-4cad-ab8a-53e61683d5e8",  1, -1,  323, 650,   49,   57],
        ["09dc0958-4e22-4898-a462-39d07e1651b2", -1,  1,  634, 666,   50,   51],

        // Data generation method:
        // px and py are randoms between 300 and 700
        // rad is a random between 37 and 80
        // mass is rad multiplied by a random between .8 and 1.2
    ];

    var planetData = {};

    for (var i in coords) {
        var data = coords[i];
        planetData[data[0]] = new Planet(
            data[0],
            new Coordinate(
                new Vector(data[1], data[2]),
                new Vector(data[3], data[4])),
            data[5],
            data[6]);
    }

    return planetData;
});
