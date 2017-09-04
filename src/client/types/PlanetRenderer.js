
define([
    'common/Math',
], function(Math) {

    var PlanetRenderer = function(game, context) {
        this.game = game;
        this.context = context;
    };

    PlanetRenderer.prototype.drawPlanets = function(planets) {

        for (var id in planets.planets) {
            this.drawPlanet(planets.planets[id]);
        }
    };

    PlanetRenderer.prototype.drawPlanet = function(planet) {
        var radius = planet.radius * this.game.view.zoom;
        var center = this.game.view.project(planet.coord);

        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.TWO_PI);
        this.context.closePath();
        this.context.stroke();
    };

    return PlanetRenderer;
});
