
define([
    'common/Constants',
    'common/Math',
    'common/types/Coordinate',
    'common/types/Vector',
    'common/types/View',
], function(Constants, Math, Coordinate, Vector, View) {
    var SectorView = function(element, planets, spaceView) {
        this.canvas = element;
        this.planets = planets;
        this.spaceView = spaceView;

        this.view = new View(this);
        this.view.minZoom = 0.001;
        this.view.zoom = this.calcZoom();

        this.sector = null;
    };

    SectorView.prototype.initialize = function() {
        this.context = this.canvas.getContext("2d");
        this.context.save();
        this.context.translate(this.canvas.width / 2,
            this.canvas.height / 2);

        this.spaceView.interest(this);
    };

    SectorView.prototype.render = function() {

        var width = this.canvas.width;
        var height = this.canvas.height;
        this.context.clearRect(-width / 2, -height / 2,
            width, height);

        if (this.sector) {
            var planets = this.planets.planetsInSector(this.sector.x,
                this.sector.y);
            if (planets) {
                for (var id in planets) {
                    this.renderPlanet(planets[id]);
                }
            }
        }
    };

    SectorView.prototype.renderPlanet = function(planet) {
        var radius = planet.radius * this.view.zoom;
        var center = this.view.project(planet.coord);

        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.TWO_PI);
        this.context.closePath();
        this.context.stroke();
    };

    SectorView.prototype.sectorSelected = function(sector) {
        this.sector = sector;
        var mid = Constants.sectorSize / 2;
        this.view.center = new Coordinate(sector, new Vector(mid, mid));
    };

    SectorView.prototype.calcZoom = function() {
        // zoom is scaling factor between the width and sector width
        return this.canvas.width / Constants.sectorSize;
    };

    return SectorView;
});
