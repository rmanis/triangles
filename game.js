
function addShip(odb, ship) {
    var id = makeGuid();
    odb.everyone[id] = ship;
    return id;
}

function loop(odb, arg) {
    var dt = (arg - odb.lastUpdate) / 1000;
    odb.lastUpdate = arg;
    updateForces(odb, dt);
    updateVel(odb, dt);
    updatePos(odb, dt);
    updateView(odb);
    drawAll(odb, dt);

    requestAnimationFrame(function(arg) {
        loop(odb, arg);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var odb = makeOdb();
    odb.canvas = document.getElementById("can");
    odb.context = odb.canvas.getContext("2d");
    odb.context.save();

    function resizeCanvas() {
        odb.context.restore();
        odb.canvas.width = window.innerWidth;
        odb.canvas.height = window.innerHeight;
        odb.context.save();
        odb.context.translate(odb.canvas.width / 2,
            odb.canvas.height / 2);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();


    var selfShip = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 10,
        mass: 1,

        theta: Math.PI * 7 / 8,
        omega: 0,

        mu: 0.05,

        thrust: 25,
        agility: Math.PI * 2,

        forces: []
    };
    var selfId = addShip(odb, selfShip);
    odb.selfId = selfId;

    setupInputs(odb);
    window.odb = odb;
    requestAnimationFrame(function(arg) {
        loop(odb, arg);
    }, odb);
}, false);

