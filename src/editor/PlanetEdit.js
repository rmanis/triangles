require([
    'editor/PlanetEditor'
], function(Ed) {

    var editor = new Ed();
    editor.initialize();

    editor.render();

    window.editor = editor;
    return editor;
});
