
(function() {
    require.config({
        baseUrl: "../src"
    });

    var tests = [
        '../test/VectorTest.js',
        '../test/MatrixTest.js',
    ];
    require(tests, function() {
        console.log(QUnit.load);
        QUnit.load();
        QUnit.start();
    });
}());
