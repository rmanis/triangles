
document.addEventListener('DOMContentLoaded', function() {
    var game = new Game();

    var selfShip = new Ship();
    game.selfId = game.addShip(selfShip);

    game.initialize();

    window.game = game;
    requestAnimationFrame(game.loop.bind(game));
}, false);

