
function updateView(odb) {
    var center = odb.view.center;
    var zoom = odb.view.zoom;
    var width = odb.canvas.width / zoom;
    var height = odb.canvas.height / zoom;
    var quartX = width / 12;
    var quartY = height / 12;

    var self = getSelf(odb);
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

function drawAll(odb) {
    odb.context.clearRect(-odb.canvas.width / 2,-odb.canvas.height / 2, odb.canvas.width, odb.canvas.height);
    for (var key in odb.everyone) {
        draw(odb, odb.everyone[key], odb.context, odb.view);
    }
    drawSegments(odb);
}

function drawSegments(odb, segments) {
    var spacing = odb.view.spacing;
    var bigSpacing = odb.view.bigSpacing;
    var gridSize = odb.view.gridSize;
    var zoom = odb.view.zoom;
    var startx = Math.floor(odb.view.center.x / spacing) * spacing;
    var starty = Math.floor(odb.view.center.y / spacing) * spacing;

    var offx = Math.floor(odb.canvas.width / (zoom * 2) / spacing) * spacing;
    var offy = Math.floor(odb.canvas.height / (zoom * 2) / spacing) * spacing;

    for (var i = startx - offx; i <= startx + offx + spacing; i += spacing) {
        for (var j = starty - offy; j <= starty + offy + spacing; j += spacing) {
            var pt = project(odb, vector(Math.floor(i / spacing) * spacing,
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
            odb.context.stroke(path);
        }
    }
}

function draw(odb, ob, context, view) {
    var siz = ob.size;
    var path = new Path2D();

    var p1 = vector(ob.x + siz * Math.cos(ob.theta),
        ob.y + siz * Math.sin(ob.theta));
    var p2 = vector(ob.x + siz * Math.cos(ob.theta + 5 * Math.PI / 6),
        ob.y + siz * Math.sin(ob.theta + 5 * Math.PI / 6));
    var p3 = vector(ob.x + siz * Math.cos(ob.theta - 5 * Math.PI / 6),
        ob.y + siz * Math.sin(ob.theta - 5 * Math.PI / 6));

    p1 = project(odb, p1);
    p2 = project(odb, p2);
    p3 = project(odb, p3);

    path.moveTo(Math.floor(p1.x), Math.floor(p1.y));
    path.lineTo(Math.floor(p2.x), Math.floor(p2.y));
    path.lineTo(Math.floor(p3.x), Math.floor(p3.y));
    path.closePath();
    context.stroke(path);
}

function project(odb, vec) {
    var width = odb.canvas.width;
    var height = odb.canvas.height;
    var zoom = odb.view.zoom;
    var center = odb.view.center;
    var x = (vec.x - center.x) * zoom;
    var y = (vec.y - center.y) * zoom;
    return vector(Math.floor(x), Math.floor(y));
}
