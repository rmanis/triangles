
function compareFloats(a, b) {
    var epsilon = 0.000000000001;
    var dif = a - b;
    return Math.abs(dif) < epsilon;
}
