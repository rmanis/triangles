
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
