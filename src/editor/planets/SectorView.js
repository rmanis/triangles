
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

        this.selectedPlanetId = null;

        this.listeners = [];

        this.styles = {
            selectedStroke     : "#000000",
            unselectedStroke   : "#222222",
            selectedFill       : "#FFFFFF",
            unselectedFill     : "#DDDDDD",
        };
    };

    SectorView.prototype.initialize = function() {
        this.context = this.canvas.getContext("2d");
        this.context.save();
        this.context.translate(this.canvas.width / 2,
            this.canvas.height / 2);

        this.spaceView.interest(this);

        this._mousedownCallback = this.mousedown.bind(this);
        this._mouseupCallback = this.mouseup.bind(this);
        this.canvas.addEventListener("mousedown",
            this._mousedownCallback, true);
        this.canvas.addEventListener("mouseup",
            this._mouseupCallback, true);
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

        var stroke = this.context.strokeStyle || "#000000";
        var fill = this.context.fillStyle || "#FFFFFF";

        if (planet.id == this.selectedPlanetId) {
            this.context.strokeStyle = this.styles.selectedStroke;
            this.context.fillStyle = this.styles.selectedFill;
        } else {
            this.context.strokeStyle = this.styles.unselectedStroke;
            this.context.fillStyle = this.styles.unselectedFill;
        }

        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.TWO_PI);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        this.context.strokeStyle = stroke;
        this.context.fillStyle = fill;

    };

    SectorView.prototype.sectorSelected = function(sector) {
        this.sector = sector;
        var mid = Constants.sectorSize / 2;
        this.view.center = new Coordinate(sector, new Vector(mid, mid));
    };

    SectorView.prototype.selectPlanet = function(id) {
        if (id == null || this.planets.planets[id]) {
            this.selectedPlanetId = id;
            this.notifyListeners();
        }
    };

    SectorView.prototype.calcZoom = function() {
        return this.canvas.width / Constants.sectorSize;
    };

    SectorView.prototype.mousedown = function(e) {
    };

    SectorView.prototype.mouseup = function(e) {
        if (!this.sector) {
            return;
        }

        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var coord = this.view.unproject(new Vector(x, y));
        var planets = this.planets.planetsInSector(this.sector.x,
            this.sector.y);

        var toSelect = null;
        for (var i in planets) {
            var p = planets[i];

            var r2 = p.radius * p.radius;
            var relative = new Vector(p.coord.pos.x - coord.pos.x, p.coord.pos.y - coord.pos.y);
            if (r2 > relative.lengthSquared()) {
                toSelect = p.id
            }
        }
        this.selectPlanet(toSelect);
    };

    SectorView.prototype.interest = function(listener) {
        this.listeners.push(listener);
    };

    SectorView.prototype.notifyListeners = function() {
        for (var i in this.listeners) {
            this.listeners[i].planetSelected(this.selectedPlanetId);
        }
    };

    return SectorView;
});
