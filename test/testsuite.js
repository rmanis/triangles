
(function() {
    require.config({
        baseUrl: "../src"
    });

    var tests = [
        '../test/VectorTest.js',
        '../test/MatrixTest.js',
    ];

    require(tests, function() {
        QUnit.load();
        QUnit.start();
    });
}());
