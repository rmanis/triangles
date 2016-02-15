
document.addEventListener('DOMContentLoaded', function() {
    var game = new Game();
    game.initialize();

    window.addEventListener('resize', game.resizeCanvas.bind(game));
    game.resizeCanvas();

    var selfShip = new Ship();
    game.selfId = game.addShip(selfShip);

    window.game = game;
    requestAnimationFrame(game.loop.bind(game));
}, false);

