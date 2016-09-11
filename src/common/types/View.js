
define([
    'common/types/Coordinate',
    'common/types/Vector'
], function(Coordinate, Vector) {
    var originals = {
        bigSpacing : 1000,
        spacing : 250,
        gridSize : 3
    };
    var View = function(game) {
        this.center = new Coordinate();
        this.zoom = 1;
        this.spacing = originals.spacing;
        this.bigSpacing = originals.bigSpacing;
        this.gridSize = originals.gridSize;

        this.game = game;

        this.scroolZoomMultiplier = 0.005;
        this.maxZoom = 3;
        this.minZoom = 0.15;
    };

    View.prototype.update = function() {
        var game = this.game;
        var center = this.center;
        var width = game.canvas.width / this.zoom;
        var height = game.canvas.height / this.zoom;
        var quartX = width / 12;
        var quartY = height / 12;

        var self = game.getSelf();
        var off = self.pos.subtract(center);
        var addx = 0;
        var addy = 0;
        if (off.x < -quartX) {
            addx = off.x + quartX;
        } else if (off.x > quartX) {
            addx = -(quartX - off.x);
        }
        if (off.y < -quartY) {
            addy = off.y + quartY;
        } else if (off.y > quartY) {
            addy = -(quartY - off.y);
        }
        center.pos.x += addx;
        center.pos.y += addy;
        center.normalize();
    };

    //
    // Renders a geometry transformed by the given matrix.  A geometry is
    // an array of line strips.
    //
    View.prototype.renderGeometry = function(geometry, matrix) {
        var m = matrix || new Matrix();
        var row;
        var p, point;
        var target;
        var ctx = this.game.context;
        for (row in geometry) {
            r = geometry[row];
            ctx.beginPath();
            for (p in r) {
                point = geometry[row][p];
                target = m.mult(point);
                if (p === 0) {
                    ctx.moveTo(target.x, target.y);
                } else {
                    ctx.lineTo(target.x, target.y);
                }
            }
            ctx.stroke();
        }
    };

    //
    // Project a point (`coord`) from game space to screen space
    //
    View.prototype.project = function(coord) {
        var width = this.game.canvas.width;
        var height = this.game.canvas.height;
        var zoom = this.game.view.zoom;
        var center = this.game.view.center;
        var vec = coord.subtract(center).scale(zoom);
        return new Vector(Math.floor(vec.x), Math.floor(vec.y));
    };

    //
    // Project a point from screen space to game space
    //
    View.prototype.unproject = function(vec) {
        var width = this.game.canvas.width;
        var height = this.game.canvas.height;
        var center = this.game.view.center;
        var dx = (vec.x - width / 2) / game.view.zoom;
        var dy = (vec.y - height / 2) / game.view.zoom;
        return new Coordinate(new Vector(center.sec.x, center.sec.y),
            new Vector(center.pos.x, center.pos.y)).add(new Vector(dx, dy)).normalize();
    };

    View.prototype.changeZoom = function(amount) {
        var newZoom = this.zoom * 1.0 + amount * this.scroolZoomMultiplier;
        if (newZoom > this.maxZoom) {
            this.zoom = this.maxZoom;
        } else if (newZoom < this.minZoom) {
            this.zoom = this.minZoom;
        } else if (newZoom > this.minZoom && newZoom < this.maxZoom) {
            this.zoom = newZoom;
        }
        // TODO: adjust grid size based on zoom.
    };

    return View;
});
