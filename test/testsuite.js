
(function() {
    require.config({
        baseUrl: "../src"
    });

    var tests = [
        '../test/VectorTest.js',
        '../test/MatrixTest.js',
        '../test/CoordinateTest.js',
    ];

    require(tests, function() {
        QUnit.load();
        QUnit.start();
    });
}());
