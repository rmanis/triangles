
define([
    'common/Constants',
    'common/types/Coordinate',
    'common/types/Vector'
], function(Constants, Coordinate, Vector) {

    var max = Constants.sectorSize;

    QUnit.module("common/types/Coordinate");

    QUnit.test('Coordinate tests (normalize)', function(assert) {

        //
        //   +---.--+   <- c5   expect ((2,4),(x,0))
        //   |      |
        //   |      .   <- c4   expect ((3,3),(0,y))
        //   |  .   |   <- c3   expect ((2,3),(x,y))
        //   .      |   <- c1   expect ((2,3),(0,y))
        // 3 +---.--+   <- c2   expect ((2,3),(x,0))
        //
        //   2
        var c1 = new Coordinate(new Vector(2,3), new Vector(0,1)).normalize();
        var c2 = new Coordinate(new Vector(2,3), new Vector(5,0)).normalize();
        var c3 = new Coordinate(new Vector(2,3), new Vector(4,6)).normalize();
        var c4 = new Coordinate(new Vector(2,3), new Vector(max,20)).normalize();
        var c5 = new Coordinate(new Vector(2,3), new Vector(10,max)).normalize();

        assert.equal(c1.sec.x, 2);
        assert.equal(c1.sec.y, 3);
        assert.equal(c1.pos.x, 0);
        assert.equal(c1.pos.y, 1);

        assert.equal(c2.sec.x, 2);
        assert.equal(c2.sec.y, 3);
        assert.equal(c2.pos.x, 5);
        assert.equal(c2.pos.y, 0);

        assert.equal(c3.sec.x, 2);
        assert.equal(c3.sec.y, 3);
        assert.equal(c3.pos.x, 4);
        assert.equal(c3.pos.y, 6);

        assert.equal(c4.sec.x, 3);
        assert.equal(c4.sec.y, 3);
        assert.equal(c4.pos.x, 0);
        assert.equal(c4.pos.y, 20);

        assert.equal(c5.sec.x, 2);
        assert.equal(c5.sec.y, 4);
        assert.equal(c5.pos.x, 10);
        assert.equal(c5.pos.y, 0);

        //
        //   +------+
        //   |      |
        //   |      |
        // . |      |   <- c8 (-5, 6) expect ((1,3),(max-5, 6))
        //   |      |
        // 3 +------+
        //  .           <- c6 (-2,-1) expect ((1,2),(max-2, max-1))
        //   2   .      <- c7 (5, -2) expect ((2,2),(    5, max-2))

        var c6 = new Coordinate(new Vector(2,3), new Vector(-2, -1)).normalize();
        var c7 = new Coordinate(new Vector(2,3), new Vector( 5, -2)).normalize();
        var c8 = new Coordinate(new Vector(2,3), new Vector(-5,  6)).normalize();

        assert.equal(c6.sec.x, 1);
        assert.equal(c6.sec.y, 2);
        assert.equal(c6.pos.x, max - 2);
        assert.equal(c6.pos.y, max - 1);

        assert.equal(c7.sec.x, 2);
        assert.equal(c7.sec.y, 2);
        assert.equal(c7.pos.x, 5);
        assert.equal(c7.pos.y, max - 2);

        assert.equal(c8.sec.x, 1);
        assert.equal(c8.sec.y, 3);
        assert.equal(c8.pos.x, max - 5);
        assert.equal(c8.pos.y, 6);

        var c5 = new Coordinate(new Vector(2,3), new Vector(max,max)).normalize();
        assert.equal(c5.sec.x, 3);
        assert.equal(c5.sec.y, 4);
        assert.equal(c5.pos.x, 0);
        assert.equal(c5.pos.y, 0);
    });

    QUnit.test('Coordinate tests (with vectors)', function(assert) {
        //
        //    +--------+
        //    |        |      >   v1
        //    |        |      v   v2
        //    |  c1    |      <   v3
        //    |  .     |      ^   v4
        //    |        |
        //    +--------+
        //
        var c1 = new Coordinate(new Vector(0,0), new Vector(10, 10));

        var v1 = new Vector( max,    0);
        var v2 = new Vector(   0, -max);
        var v3 = new Vector(-max,    0);
        var v4 = new Vector(   0,  max);

        var c1_1 = c1.add(v1).normalize();
        assert.equal(c1_1.sec.x, 1);
        assert.equal(c1_1.sec.y, 0);
        assert.equal(c1_1.pos.x,10);
        assert.equal(c1_1.pos.y,10);

        var c1_2 = c1.add(v2).normalize();
        assert.equal(c1_2.sec.x, 0);
        assert.equal(c1_2.sec.y,-1);
        assert.equal(c1_2.pos.x,10);
        assert.equal(c1_2.pos.y,10);

        var c1_3 = c1.add(v3).normalize();
        assert.equal(c1_3.sec.x,-1);
        assert.equal(c1_3.sec.y, 0);
        assert.equal(c1_3.pos.x,10);
        assert.equal(c1_3.pos.y,10);

        var c1_4 = c1.add(v4).normalize();
        assert.equal(c1_4.sec.x, 0);
        assert.equal(c1_4.sec.y, 1);
        assert.equal(c1_4.pos.x,10);
        assert.equal(c1_4.pos.y,10);

    });

    QUnit.test('Coordinate tests (distances)', function(assert) {
        var a = new Coordinate(new Vector(0,0), new Vector(1,0));
        var a2 = new Coordinate(new Vector(0,0), new Vector(2,0));
        var b = new Coordinate(new Vector(1,0), new Vector(1,0));
        var b2 = new Coordinate(new Vector(1,0), new Vector(0,0));

        var va = a.subtract(a2);
        assert.equal(va.x, -1, "Same sector dx");
        assert.equal(va.y, 0, "Same sector dy");

        var vab = a.subtract(b);
        assert.equal(vab.x, -max, "One sector over dx");
        assert.equal(vab.y, 0, "One sector over dy");

        var va2b = a2.subtract(b);
        assert.equal(va2b.x, -max + 1, "One sector over minus one dx");
        assert.equal(va2b.y, 0, "One sector over minus one dy");

        var vba2 = b.subtract(a2);
        assert.equal(vba2.x, max - 1, "One sector over minus one dx, backwards");
        assert.equal(vba2.y, 0, "One sector over minus one dy, backwards");

        var ab2 = a.subtract(b2);
        assert.equal(ab2.x, -max + 1);
        assert.equal(ab2.y, 0);

        var b2a = b2.subtract(a);
        assert.equal(b2a.x, max - 1);
        assert.equal(b2a.y, 0);

        var c = new Coordinate(new Vector(0,1), new Vector(2,1));
        var ac = a.subtract(c);
        assert.equal(ac.x, -1);
        assert.equal(ac.y, -(max + 1));

        var ca = c.subtract(a);
        assert.equal(ca.x, 1);
        assert.equal(ca.y, max + 1);
    });
});
