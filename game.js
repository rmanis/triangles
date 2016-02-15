
function addShip(game, ship) {
    var id = makeGuid();
    game.everyone[id] = ship;
    return id;
}

document.addEventListener('DOMContentLoaded', function() {
    var game = new Game();
    game.initialize();

    window.addEventListener('resize', game.resizeCanvas.bind(game));
    game.resizeCanvas();

    var selfShip = new Ship();
    var selfId = addShip(game, selfShip);
    game.selfId = selfId;

    setupInputs(game);
    window.game = game;
    requestAnimationFrame(game.loop.bind(game));
}, false);

