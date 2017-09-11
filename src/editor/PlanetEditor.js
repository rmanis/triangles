
define([
    'common/types/Planets',
    'editor/planets/SpaceView',
    'editor/planets/SectorView',
    'editor/planets/PropertyInputs',
    'editor/planets/DataView',
], function(Planets, SpaceView, SectorView, PropertyInputs, DataView) {

    var PlanetEditor = function() {
        this.planets = null;

        this.spaceView = null;
        this.sectorView = null;
        this.propertyInputs = null;
        this.dataTextarea = null;
    };

    PlanetEditor.prototype.initialize = function() {

        this.planets = new Planets();
        this.planets.initialize();

        this.spaceView      = new SpaceView(document.getElementById('spaceGrid'), this.planets);
        this.spaceView.initialize();
        this.sectorView     = new SectorView(document.getElementById('sectorView'), this.planets, this.spaceView);
        this.propertyInputs = new PropertyInputs(document.getElementById('propertyInputs'), this.planets, this.propertyInputs);
        this.dataTextarea   = new DataView(document.getElementById('planetData'), this.planets);
    };

    PlanetEditor.prototype.render = function(dt) {

        this.spaceView.render();
        this.sectorView.render();
        window.requestAnimationFrame(this.render.bind(this));
    };

    return PlanetEditor;
});
