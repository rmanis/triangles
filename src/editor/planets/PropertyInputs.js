
define([
], function() {
    var PropertyInputs = function(element, planets, sectorView) {
        this.element = element;
        this.planets = planets;
        this.sectorView = sectorView;

        this.idInput = null;
        this.xInput = null;
        this.yInput = null;
        this.radiusInput = null;
        this.massInput = null;
    };

    PropertyInputs.prototype.initialize = function() {
        this.sectorView.interest(this);

        this.idInput     = document.getElementById("idInput");
        this.xInput      = document.getElementById("xInput");
        this.yInput      = document.getElementById("yInput");
        this.radiusInput = document.getElementById("radiusInput");
        this.massInput   = document.getElementById("massInput");
    };

    PropertyInputs.prototype.planetSelected = function(id) {
        var planet = this.planets.planets[id];

        if (planet) {
            this.fillForm(planet);
        }
    };

    PropertyInputs.prototype.fillForm = function(planet) {
        console.log(planet);
        this.idInput.value = planet.id;
        this.xInput.value = planet.coord.pos.x;
        this.yInput.value = planet.coord.pos.y;
        this.radiusInput.value = planet.radius;
        this.massInput.value = planet.mass;
    };

    return PropertyInputs;
});
