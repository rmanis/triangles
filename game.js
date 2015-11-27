
function addShip(game, ship) {
    var id = makeGuid();
    game.everyone[id] = ship;
    return id;
}

function loop(game, arg) {
    var dt = (arg - game.lastUpdate) / 1000;
    game.lastUpdate = arg;
    updateForces(game, dt);
    updateVel(game, dt);
    updatePos(game, dt);
    updateView(game);
    drawAll(game, dt);

    requestAnimationFrame(function(arg) {
        loop(game, arg);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var game = makeGame();
    game.canvas = document.getElementById("can");
    game.context = game.canvas.getContext("2d");
    game.context.save();

    function resizeCanvas() {
        game.context.restore();
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
        game.context.save();
        game.context.translate(game.canvas.width / 2,
            game.canvas.height / 2);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();


    var selfShip = new Ship();
    var selfId = addShip(game, selfShip);
    game.selfId = selfId;

    setupInputs(game);
    window.game = game;
    requestAnimationFrame(function(arg) {
        loop(game, arg);
    }, game);
}, false);

