
define([
    'client/Game',
    'common/types/Ship'
    ], function(
            Game,
            Ship) {

        var game = new Game();

        var selfShip = new Ship();
        game.selfId = game.addShip(selfShip);

        if (window) {
            game.initialize();

            window.game = game;
            requestAnimationFrame(game.loop.bind(game));
            debug("Started");
        }
        return game;
});
