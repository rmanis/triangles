
define([
], function() {

    var StompButton = function(parentElement, stomp) {
        this.parentElement = parentElement;
        this.element = null;
        this.stomp = stomp;
    };

    StompButton.prototype.initialize = function() {
        this.element = document.createElement("div");
        this.element.classList.add("statusButton");
        this.element.addEventListener('click', this.onclick.bind(this));
        this.parentElement.append(this.element);

        this.stomp.interest(this);
    };

    StompButton.prototype.update = function() {
        if (this.stomp && this.stomp.isConnected()) {
            this.goGreen();
        } else {
            this.goRed();
        }
    };

    StompButton.prototype.onclick = function() {
        if (!this.stomp.isConnected()) {
            this.stomp.connect();
        }
    };

    StompButton.prototype.onConnect = function() {
        this.update();
    };

    StompButton.prototype.onError = function() {
        this.update();
    };

    StompButton.prototype.onDisconnect = function() {
        this.update();
    };

    StompButton.prototype.goGreen = function() {
        if (!this.element.classList.contains('greenback')) {
            this.element.classList.remove('redback');
            this.element.classList.add('greenback');
        }
    };

    StompButton.prototype.goRed = function() {
        if (!this.element.classList.contains('redback')) {
            this.element.classList.remove('greenback');
            this.element.classList.add('redback');
        }
    };

    return StompButton;

});
