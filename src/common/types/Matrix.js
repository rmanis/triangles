
//
// Constructor for a matrix of the form:
//
//  |a b|
//  |c d|
//
// All arguments being optional, defaulting to the identity matrix.
//
var Matrix = function(a, b, c, d) {
    this.m00 = a || 1;
    this.m01 = b || 0;
    this.m10 = c || 0;
    this.m11 = d || 1;
};

//
// Create a rotation matrix for a given angle in radians.
//
Matrix.rotate = function(theta) {
    return new Matrix(
        Math.cos(theta), -Math.sin(theta),
        Math.sin(theta), Math.cos(theta));
};

//
// Multiply this matrix by vector v.
//
//  | a  b |     | x |     | ax + by |
//  |      |  x  |   |  =  |         |
//  | c  d |     | y |     | cx + dy |
//
Matrix.prototype.mult = function(v) {
    return new Vector(this.m00 * v.x + this.m01 * v.y,
        this.m10 * v.x + this.m11 * v.y);
};
