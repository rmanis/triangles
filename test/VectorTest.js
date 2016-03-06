
QUnit.test('Vector tests', function(assert) {
    var v1 = new Vector(1, 0);
    var v2 = new Vector(0, 1);
    var v3 = new vector(1,1).normalize();

    var r1 = v1.dot(v2);
    assert.ok(compareFloats(r1, 0));

    var v4 = new Vector(3,4);
    assert.ok(compareFloats(v4.length(), 5));

    // 3 * sqrt(2)/2 + 4 * sqrt(2)/2
    // == 7 * sqrt(2)
    var r2 = v3.dot(v4);
    assert.ok(compareFloats(r2, 7 * Math.sqrt(2) / 2));
});
