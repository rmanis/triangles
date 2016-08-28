
define([], function() {
    //
    // Constructor for a matrix of the form:
    //
    //  |a b c|
    //  |d e f|
    //  |g h i|
    //
    // All arguments being optional, defaulting to the identity matrix.
    //
    var Matrix = function(a, b, c, d, e, f, g, h, i) {
        this.m00 = a || 1;
        this.m01 = b || 0;
        this.m02 = c || 0;
        this.m10 = d || 0;
        this.m11 = e || 1;
        this.m12 = f || 0;
        this.m20 = g || 0;
        this.m21 = h || 0;
        this.m22 = i || 1;
    };

    //
    // Create a rotation matrix for a given angle in radians.
    //
    Matrix.rotate = function(theta) {
        return new Matrix(
            Math.cos(theta), -Math.sin(theta), 0,
            Math.sin(theta), Math.cos(theta), 0,
            0, 0, 1);
    };

    //
    // Multiply this matrix by vector v.
    //
    //  | a  b  c |     | x |     | ax + by + cz |
    //  |         |     |   |     |              |
    //  | d  e  f |  x  | y |  =  | dx + ey + fz |
    //  |         |     |   |     |              |
    //  | g  h  i |     | z |     | gx + hy + iz |
    //
    Matrix.prototype.mult = function(v) {
        return new Vector(
            this.m00 * v.x + this.m01 * v.y + this.m02 * v.z,
            this.m10 * v.x + this.m11 * v.y + this.m12 * v.z,
            this.m20 * v.x + this.m21 * v.y + this.m22 * v.z);
    };

    return Matrix;
});
