
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
        if (id) {
            var planet = this.planets.planets[id];

            if (planet) {
                this.fillForm(planet);
            }
        } else {
            this.fillForm(null);
        }
    };

    PropertyInputs.prototype.fillForm = function(planet) {
        if (planet) {
            this.idInput.value = planet.id;
            this.xInput.value = planet.coord.pos.x;
            this.yInput.value = planet.coord.pos.y;
            this.radiusInput.value = planet.radius;
            this.massInput.value = planet.mass;
        } else {
            this.idInput.value = "";
            this.xInput.value = "";
            this.yInput.value = "";
            this.radiusInput.value = "";
            this.massInput.value = "";
        }
    };

    return PropertyInputs;
});
