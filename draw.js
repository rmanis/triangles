
function updateView(game) {
    var center = game.view.center;
    var zoom = game.view.zoom;
    var width = game.canvas.width / zoom;
    var height = game.canvas.height / zoom;
    var quartX = width / 12;
    var quartY = height / 12;

    var self = getSelf(game);
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
}

function drawAll(game) {
    game.context.clearRect(-game.canvas.width / 2,
        -game.canvas.height / 2,
        game.canvas.width,
        game.canvas.height);
    for (var key in game.everyone) {
        draw(game, game.everyone[key], game.context, game.view);
    }
    drawSegments(game);
}

function drawSegments(game, segments) {
    var spacing = game.view.spacing;
    var bigSpacing = game.view.bigSpacing;
    var gridSize = game.view.gridSize;
    var zoom = game.view.zoom;
    var startx = Math.floor(game.view.center.x / spacing) * spacing;
    var starty = Math.floor(game.view.center.y / spacing) * spacing;

    var offx = Math.floor(game.canvas.width / (zoom * 2) / spacing) * spacing;
    var offy = Math.floor(game.canvas.height / (zoom * 2) / spacing) * spacing;

    var endx = startx + offx + spacing;
    var endy = starty + offy + spacing;

    for (var i = startx - offx; i <= endx; i += spacing) {
        for (var j = starty - offy; j <= endy; j += spacing) {
            var pt = project(game, vector(Math.floor(i / spacing) * spacing,
                Math.floor(j / spacing) * spacing));
            var path = new Path2D();
            var siz = gridSize * zoom;
            if (i % bigSpacing == 0 && j % bigSpacing == 0) {
                siz *= 2;
            }
            path.moveTo(pt.x - siz, pt.y);
            path.lineTo(pt.x + siz, pt.y);
            path.moveTo(pt.x, pt.y - siz);
            path.lineTo(pt.x, pt.y + siz);
            game.context.stroke(path);
        }
    }
}

function draw(game, ob, context, view) {
    var siz = ob.size;
    var path = new Path2D();

    var p1 = vector(ob.x + siz * Math.cos(ob.theta),
        ob.y + siz * Math.sin(ob.theta));
    var p2 = vector(ob.x + siz * Math.cos(ob.theta + 5 * Math.PI / 6),
        ob.y + siz * Math.sin(ob.theta + 5 * Math.PI / 6));
    var p3 = vector(ob.x + siz * Math.cos(ob.theta - 5 * Math.PI / 6),
        ob.y + siz * Math.sin(ob.theta - 5 * Math.PI / 6));

    p1 = project(game, p1);
    p2 = project(game, p2);
    p3 = project(game, p3);

    path.moveTo(Math.floor(p1.x), Math.floor(p1.y));
    path.lineTo(Math.floor(p2.x), Math.floor(p2.y));
    path.lineTo(Math.floor(p3.x), Math.floor(p3.y));
    path.closePath();
    context.stroke(path);
}

function project(game, vec) {
    var width = game.canvas.width;
    var height = game.canvas.height;
    var zoom = game.view.zoom;
    var center = game.view.center;
    var x = (vec.x - center.x) * zoom;
    var y = (vec.y - center.y) * zoom;
    return vector(Math.floor(x), Math.floor(y));
}
