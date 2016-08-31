
define(['common/types/Vector'], function(Vector) {
    var View = function(game) {
        this.center = new Vector(0, 0);
        this.zoom = 1;
        this.spacing = 250;
        this.bigSpacing = 1000;
        this.gridSize = 3;

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
        if (self.x < (center.x - quartX)) {
            center.x = self.x + quartX;
        } else if (self.x > (center.x + quartX)) {
            center.x = self.x - quartX;
        }
        if (self.y < (center.y - quartY)) {
            center.y = self.y + quartY;
        } else if (self.y > (center.y + quartY)) {
            center.y = self.y - quartY;
        }
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
    // Project a point (`vec`) from game space to screen space
    //
    View.prototype.project = function(vec) {
        var width = this.game.canvas.width;
        var height = this.game.canvas.height;
        var zoom = this.game.view.zoom;
        var center = this.game.view.center;
        var x = (vec.x - center.x) * zoom;
        var y = (vec.y - center.y) * zoom;
        return new Vector(Math.floor(x), Math.floor(y));
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
        return new Vector(dx + center.x, dy + center.y);
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
    };

    return View;
});
