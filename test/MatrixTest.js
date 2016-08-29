
define(["common/types/Vector",
        "common/types/Matrix"],
    function(
        Vector,
        Matrix) {

    QUnit.module("common/types/Matrix");

    QUnit.test('Matrix tests (basic)', function(assert) {
        var m1 = new Matrix();

        assert.ok(compareFloats(m1.m00, 1));
        assert.ok(compareFloats(m1.m01, 0));
        assert.ok(compareFloats(m1.m10, 0));
        assert.ok(compareFloats(m1.m11, 1));

        var v1 = new Vector(1, 0);
        var vr1 = m1.mult(v1);
        assert.equal(vr1.x, 1);
        assert.equal(vr1.y, 0);

        var v2 = new Vector(0, 1);
        var vr2 = m1.mult(v2);
        assert.equal(vr2.x, 0);
        assert.equal(vr2.y, 1);

        var m2 = new Matrix(
            2, 1, 0,
            1, 2, 0,
            0, 0, 1);
        var v3 = new Vector(1, 2).normalize();
        var vr3 = m2.mult(v3);

        var root5 = Math.sqrt(5);
        // v3.length = sqrt(5)
        // v3.x = 1/sqrt(5)
        // v3.y = 2/sqrt(5)
        assert.ok(compareFloats(vr3.x, 4 / root5));
        assert.ok(compareFloats(vr3.y, 1 / root5 + 4 / root5));
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
});
