
define([
    'common/Constants',
    'common/types/Coordinate',
    'common/types/Vector',
    'common/types/View',
], function(Constants, Coordinate, Vector, View) {

    var SpaceView = function(element, planets) {
        this.planets = planets;
        this.canvas = element;
        this.context = null;
        this.view = new View(this);

        this.view.minZoom = 0.01;
        this.view.zoom = 0.05;
        this.margin = 25;

        this.clickCoord = null;
    };

    SpaceView.prototype.initialize = function() {
        this.context = this.canvas.getContext("2d");
        this.context.save();
        this.context.translate(this.canvas.width / 2,
            this.canvas.height / 2);

        this.mousedownCallback = this.mousedown.bind(this);
        this.mouseupCallback = this.mouseup.bind(this);
        this.mousemoveCallback = this.mousemove.bind(this);

        this.canvas.addEventListener("mousedown",
            this.mousedownCallback, true);
        this.canvas.addEventListener("mouseup",
            this.mouseupCallback, true);
    };

    SpaceView.prototype.resizeCanvas = function() {
    };

    SpaceView.prototype.render = function() {
        // draw the sectors we can see
        var xmin, xmax;
        var ymin, ymax;

        var topleft = this.view.topLeft(this.canvas);
        var bottomRight = this.view.bottomRight(this.canvas);

        var width = this.canvas.width;
        var height = this.canvas.height;
        this.context.clearRect(-width / 2, -height / 2,
            width, height);

        xmin = topleft.sec.x;
        xmax = bottomRight.sec.x;
        ymin = topleft.sec.y;
        ymax = bottomRight.sec.y;

        for (var y = ymin; y <= ymax; y++) {
            for (var x = xmin; x <= xmax; x++) {
                this.renderSector(x, y);
            }
        }
    };

    SpaceView.prototype.renderSector = function(x, y) {
        // draw a square for the sector
        var margin = this.margin;
        var topLeft = this.view.project(new Coordinate(new Vector(x, y), new Vector(margin, margin)));
        var botRight = this.view.project(new Coordinate(new Vector(x, y),
            new Vector(Constants.sectorSize - margin, Constants.sectorSize - margin)));

        this.context.beginPath();
        this.context.moveTo(topLeft.x, topLeft.y);
        this.context.lineTo(topLeft.x, botRight.y);
        this.context.lineTo(botRight.x, botRight.y);
        this.context.lineTo(botRight.x, topLeft.y);
        this.context.closePath();
        this.context.stroke();

        var planets = this.planets.planetsInSector(x, y);
        if (planets && Object.keys(planets).length > 0) {
            this.context.fill();
        }
    };

    SpaceView.prototype.coordinateForEvent = function(e) {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        return this.view.unproject(new Vector(x, y));
    };

    SpaceView.prototype.mousedown = function(e) {
        // pointStart(e);
        this.clickCoord = this.coordinateForEvent(e);
        this.canvas.addEventListener("mousemove", this.mousemoveCallback);
        e.stopPropagation();
    };

    SpaceView.prototype.mouseup = function(e) {
        this.canvas.removeEventListener("mousemove", this.mousemoveCallback);

        // if not moved
        var coord = this.coordinateForEvent(e);
        if (coord.equals(this.clickCoord)) {
            console.log("Regular click");
        }
    };

    SpaceView.prototype.mousemove = function(e) {
        var movex = e.movementX / this.view.zoom;
        var movey = e.movementY / this.view.zoom;

        this.view.center.pos.x -= movex;
        this.view.center.pos.y -= movey;
        this.view.center.normalize();
    };

    return SpaceView;
});
