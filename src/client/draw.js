
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

function drawSegments(game) {
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
            var pt = game.view.project(vector(Math.floor(i / spacing) * spacing,
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

    p1 = game.view.project(p1);
    p2 = game.view.project(p2);
    p3 = game.view.project(p3);

    path.moveTo(Math.floor(p1.x), Math.floor(p1.y));
    path.lineTo(Math.floor(p2.x), Math.floor(p2.y));
    path.lineTo(Math.floor(p3.x), Math.floor(p3.y));
    path.closePath();
    context.stroke(path);
}

