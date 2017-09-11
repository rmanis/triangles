
define([
    'common/Constants',
    'common/Guid',
    'common/types/Coordinate',
    'common/types/Planet',
    'common/types/Vector',
], function(Constants, Guid, Coordinate, Planet, Vector) {
    var PropertyInputs = function(element, planets, sectorView) {
        this.element = element;
        this.planets = planets;
        this.sectorView = sectorView;

        this.selectedPlanetId = null;

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

        this.newPlanetButton = document.getElementById("newPlanet");
        this.delPlanetButton = document.getElementById("deletePlanet");
        this.commitPlanetButton = document.getElementById("commitPlanet");

        this.newPlanetButton.addEventListener("click", this.newPlanet.bind(this));
        this.delPlanetButton.addEventListener("click", this.deleteSelectedPlanet.bind(this));
        this.commitPlanetButton.addEventListener("click", this.commitSelectedPlanet.bind(this));
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
        this.selectedPlanetId = id;
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

    PropertyInputs.prototype.pullForm = function() {
        var id = this.selectedPlanetId;
        if (!id) {
            return;
        }

        var p = this.planets.planets[id];
        if (p) {
            p.id = this.idInput.value;
            p.coord.pos.x = Number.parseInt(this.xInput.value);
            p.coord.pos.y = Number.parseInt(this.yInput.value);
            p.coord.radius = Number.parseInt(this.radiusInput.value);
            p.coord.radius = Number.parseInt(this.massInput.value);
            this.planets.addPlanet(p);
        }
    };

    PropertyInputs.prototype.newPlanet = function(e) {
        this.planetSelected(null);

        var half = Constants.sectorSize / 2;
        var p = new Planet(
            Guid(),
            new Coordinate(this.sectorView.sector,
                new Vector(half, half)),
            50,
            50);
        this.planets.addPlanet(p);

        this.sectorView.selectPlanet(p.id);
    };

    PropertyInputs.prototype.deleteSelectedPlanet = function(e) {
        this.planets.deletePlanet(this.selectedPlanetId);
        this.fillForm(null);
    };

    PropertyInputs.prototype.commitSelectedPlanet = function(e) {
        this.pullForm();
    };

    return PropertyInputs;
});
