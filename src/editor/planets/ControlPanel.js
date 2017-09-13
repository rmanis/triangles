
define([
], function() {

    var ControlPanel = function(element) {
        this.element = element;

        this.buttons = [];
    };

    ControlPanel.prototype.initialize = function() {

        for (var i in this.buttons) {
            var b = this.buttons[i];
            b.initialize();
        }
    };

    ControlPanel.prototype.update = function() {
        this.buttons.map(function(b) {
            b.update();
        });
    };

    ControlPanel.prototype.addButton = function(button) {
        this.buttons.push(button);
    };

    ControlPanel.prototype.append = function(element) {
        this.element.append(element);
    };

    return ControlPanel;
});
