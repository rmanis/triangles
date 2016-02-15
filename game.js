
document.addEventListener('DOMContentLoaded', function() {
    var game = new Game();

    var selfShip = new Ship();
    game.selfId = game.addShip(selfShip);

    game.initialize();

    window.game = game;
    requestAnimationFrame(game.loop.bind(game));
    debug("Started");
}, false);

function debug(text) {
    var deb = document.getElementById('debug');
    var p = document.createElement('pre');
    p.textContent = text;
    deb.appendChild(p);
    deb.scrollTop = deb.scrollHeight;
}
