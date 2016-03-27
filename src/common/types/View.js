
var View = function(game) {
    this.center = vector(0, 0);
    this.zoom = 1;
    this.spacing = 250;
    this.bigSpacing = 1000;
    this.gridSize = 3;

    this.game = game;
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
// Project a point (`vec`) from game space to screen space
//
View.prototype.project = function(vec) {
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;
    var zoom = this.game.view.zoom;
    var center = this.game.view.center;
    var x = (vec.x - center.x) * zoom;
    var y = (vec.y - center.y) * zoom;
    return vector(Math.floor(x), Math.floor(y));
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
    return vector(dx + center.x, dy + center.y);
};
