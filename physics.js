
function updateForces(game, dt) {
    var ship = game.everyone[game.selfId];
    var keys = game.keysPressed;

    for (var key in keys) {
        var binding = game.keyBindings[key];
        if (keys[key] && binding) {
            binding();
        }
    }

    ship.theta += ship.omega * dt;
    ship.omega = 0;
}

function updatePos(game, dt) {
    for (var key in game.everyone) {
        var o = game.everyone[key];
        o.x += o.vx * dt;
        o.y += o.vy * dt;
    }
}

function friction(ship) {
    var dragx = -ship.mu * ship.mass * ship.vx;
    var dragy = -ship.mu * ship.mass * ship.vy;
    return vector(dragx, dragy);
}

function dummyThrust(ship) {
    return vector(Math.cos(ship.theta), Math.sin(ship.theta));
}

function sumForces(forces) {
    var x = 0, y = 0;
    for (var i in forces) {
        x += forces[i].x;
        y += forces[i].y;
    }
    return vector(x, y);
}

function updateVel(game, dt) {
    for (var key in game.everyone) {
        var ship = game.everyone[key];
        var frictionalForce = friction(ship);
        var sum = sumForces(ship.forces.concat([frictionalForce]));
        ship.vx += sum.x * ship.mass;
        ship.vy += sum.y * ship.mass;

        if (Math.abs(ship.vx) < epsilon) {
            ship.vx = 0;
        }
        if (Math.abs(ship.vy) < epsilon) {
            ship.vy = 0;
        }

        ship.forces = [];
    }
}

function addForce(ship, force) {
    ship.forces.push(force);
}

function turnLeft(ship) {
    ship.omega = -ship.agility;
}

function increaseThrust(ship) {
    addForce(ship, vector(
        ship.thrust * Math.cos(ship.theta),
        ship.thrust * Math.sin(ship.theta)
    ));
}

function turnRight(ship) {
    ship.omega = ship.agility;
}

function slowDown(ship) {
}

