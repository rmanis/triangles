
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
        ["37fc6eeb-0a29-4cad-ab8a-53e61683d5e8",  1, -1,  323, 650,   49,   57],
        ["a965c89c-c51d-4024-9484-b75822089f61",  7, -3,   50,  89,   40,   65],
        ["e2b9758e-8e74-4d3b-61c3-addfedca4720",  7, -3,  650, 589,   54,   64],
        ["89853f16-e8ae-4522-4355-f5ebb4fe6b9d",  1, -6,  394, 325,   69,   82],
        ["3c324d97-6be9-4a01-2851-40ce17ec2655", -4,  5,  634, 666,   50,   51],
        ["6527a038-11a1-474d-b57a-b5f40e2027e0", -6, -1,  365, 648,   79,   74],
        ["4a34c607-c5a6-42f3-a479-ff513f615bc4", -4, -5,  666, 302,   59,   64],
        ["8070f84d-1620-4c07-77ca-4d227d436ce9",  7,  9,  348, 534,   52,   46],
        ["84c9cdb2-97c0-4fe0-4942-79c32e80f31a", -1, 10,  593, 536,   57,   50],
        ["50985c7b-2372-4d00-9f4b-2934060a0f7a",  5,  3,  393, 461,   78,   87]

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
