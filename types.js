
var KEY_LEFT = 37;
var KEY_UP = 38
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var epsilon = 0.000001;

function makeGuid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" +
        S4() + "-4" +
        S4().substr(0,3) + "-" +
        S4() + "-" +
        S4() + S4() + S4()).toLowerCase();
}

function vector(x, y) {
    return { x: x, y: y };
}
