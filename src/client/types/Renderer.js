
//
// The renderer
//
// Keeps an image of the world and dead-reckons, drawing where things
// should be.
//

define([], function() {

    var Renderer = function(game, canvas, context) {

        this.game = game;
        this.canvas = canvas;
        this.context = context;
    };

    Renderer.prototype.drawAll = function(dt) {
        var width = this.canvas.width;
        var height = this.canvas.height;
        this.context.clearRect(-width / 2, -height / 2,
            width, height);
        for (var key in this.game.everyone) {
            this.draw(game.everyone[key]);
        }
        this.drawSegments();
    };

    //
    // Draws the grid markings that give reference points in the world.
    //
    Renderer.prototype.drawSegments = function() {
        var view = this.game.view;
        // Little crosses
        var spacing = view.spacing;
        // Big crosses
        var bigSpacing = view.bigSpacing;
        // How long the little crosses are, radius
        var gridSize = view.gridSize;
        var zoom = view.zoom;
        var startx = Math.floor(view.center.x / spacing) * spacing;
        var starty = Math.floor(view.center.y / spacing) * spacing;

        var offx = Math.floor(game.canvas.width / (zoom * 2) / spacing) * spacing;
        var offy = Math.floor(game.canvas.height / (zoom * 2) / spacing) * spacing;

        var endx = startx + offx + spacing;
        var endy = starty + offy + spacing;

        for (var i = startx - offx; i <= endx; i += spacing) {
            for (var j = starty - offy; j <= endy; j += spacing) {
                var pt = view.project(vector(Math.floor(i / spacing) * spacing,
                    Math.floor(j / spacing) * spacing));
                var path = new Path2D();
                var siz = gridSize * zoom;
                if (i % bigSpacing === 0 && j % bigSpacing === 0) {
                    siz *= 2;
                }
                path.moveTo(pt.x - siz, pt.y);
                path.lineTo(pt.x + siz, pt.y);
                path.moveTo(pt.x, pt.y - siz);
                path.lineTo(pt.x, pt.y + siz);
                game.context.stroke(path);
            }
        }
    };

    Renderer.prototype.draw = function(ob) {
        var siz = ob.size;
        var path = new Path2D();

        // TODO: use the ship's geometry
        // the geometry should be a field on the render component on the ship
        // the transformation matrix should be updated and stored on the render component
        var p1 = vector(ob.x + siz * Math.cos(ob.theta),
            ob.y + siz * Math.sin(ob.theta));
        var p2 = vector(ob.x + siz * Math.cos(ob.theta + 5 * Math.PI / 6),
            ob.y + siz * Math.sin(ob.theta + 5 * Math.PI / 6));
        var p3 = vector(ob.x + siz * Math.cos(ob.theta - 5 * Math.PI / 6),
            ob.y + siz * Math.sin(ob.theta - 5 * Math.PI / 6));

        p1 = this.game.view.project(p1);
        p2 = this.game.view.project(p2);
        p3 = this.game.view.project(p3);

        path.moveTo(Math.floor(p1.x), Math.floor(p1.y));
        path.lineTo(Math.floor(p2.x), Math.floor(p2.y));
        path.lineTo(Math.floor(p3.x), Math.floor(p3.y));
        path.closePath();
        this.context.stroke(path);
    };

    return Renderer;
});

