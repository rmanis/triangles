
define([
    'common/types/Planets',
    'editor/planets/SpaceView',
    'editor/planets/SectorView',
    'editor/planets/PropertyInputs',
    'editor/planets/DataView',
    'editor/planets/ControlPanel',
    'editor/planets/EditorStomp',
    'editor/planets/StompButton',
], function(Planets, SpaceView, SectorView, PropertyInputs, DataView, ControlPanel, EditorStomp, StompButton) {

    var PlanetEditor = function() {
        this.planets = null;
        this.stomp = null;

        this.spaceView = null;
        this.sectorView = null;
        this.propertyInputs = null;
        this.dataTextarea = null;
        this.controlPanel = null;
    };

    PlanetEditor.prototype.initialize = function() {

        this.planets = new Planets();
        this.planets.initialize({});

        this.stomp = new EditorStomp(this.planets);
        this.stomp.initialize();

        this.spaceView      = new SpaceView(document.getElementById('spaceGrid'), this.planets);
        this.spaceView.initialize();
        this.sectorView     = new SectorView(document.getElementById('sectorView'), this.planets, this.spaceView);
        this.sectorView.initialize();
        this.propertyInputs = new PropertyInputs(document.getElementById('propertyInputs'), this.planets, this.sectorView);
        this.propertyInputs.initialize();
        this.dataTextarea   = new DataView(document.getElementById('planetData'), this.planets);
        this.dataTextarea.initialize();

        this.controlPanel = new ControlPanel(document.getElementById('controlPanel'));
        this.buildControlPanel(this.controlPanel);
        this.controlPanel.initialize();
    };

    PlanetEditor.prototype.buildControlPanel = function(panel) {
        var stompButton = new StompButton(this.controlPanel, this.stomp);
        panel.addButton(stompButton);
    };

    PlanetEditor.prototype.update = function(dt) {
        this.controlPanel.update(dt);
    };

    PlanetEditor.prototype.render = function(dt) {

        this.spaceView.render();
        this.sectorView.render();
        // this.update();
        window.requestAnimationFrame(this.render.bind(this));
    };

    return PlanetEditor;
});
