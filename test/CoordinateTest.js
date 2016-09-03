
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
});
