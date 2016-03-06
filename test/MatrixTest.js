
function compareFloats(a, b) {
    var epsilon = 0.000000000001;
    var dif = a - b;
    return Math.abs(dif) < epsilon;
}

QUnit.test('Matrix tests (basic)', function(assert) {
    var m1 = new Matrix();

    assert.ok(compareFloats(m1.m00, 1));
    assert.ok(compareFloats(m1.m01, 0));
    assert.ok(compareFloats(m1.m10, 0));
    assert.ok(compareFloats(m1.m11, 1));

    var v1 = new Vector(1, 0);
    var vr1 = m1.mult(v1);

    // assert.equal(vr1.x,

    var v2 = new Vector(0, 1);
    var vr2 = m1.mult(v2);

    var v3 = new vector(1,1).normalize();
    var vr3 = m1.mult(v3);
});

QUnit.test('Matrix tests (rotation)', function(assert) {
    var m = Matrix.rotate(Math.PI / 2);
    var v1 = new Vector(1,0);
    var r = m.mult(v1);

    assert.ok(compareFloats(r.x, 0));
    assert.ok(compareFloats(r.y, 1));

    var n = Matrix.rotate(5 * Math.PI / 4);
    var s = n.mult(v1);

    assert.ok(compareFloats(s.x, -Math.sqrt(2) / 2));
    assert.ok(compareFloats(s.y, -Math.sqrt(2) / 2));
});
