
define(['common/types/Vector'], function(Vector) {
    var TWO_PI = 2 * Math.PI;

    var epsilon = 0.000001;

    var Physics = {

        updateForces: function(game, dt) {
            var ship = game.everyone[game.selfId];

            var theta = ship.theta + ship.omega * dt;

            if (theta < 0 || theta > TWO_PI) {
                theta = (TWO_PI + theta) % TWO_PI;
            }

            ship.theta = theta;
            ship.omega = 0;
        },

        updatePos: function(game, dt) {
            for (var key in game.everyone) {
                var o = game.everyone[key];
                o.pos.pos.x += o.vx * dt;
                o.pos.pos.y += o.vy * dt;
                o.pos.normalize();
            }
        },

        friction: function(ship) {
            var dragx = -ship.mu * ship.mass * ship.vx;
            var dragy = -ship.mu * ship.mass * ship.vy;
            return new Vector(dragx, dragy);
        },

        dummyThrust: function(ship) {
            return new Vector(Math.cos(ship.theta), Math.sin(ship.theta));
        },

        sumForces: function(forces) {
            var x = 0, y = 0;
            for (var i in forces) {
                x += forces[i].x;
                y += forces[i].y;
            }
            return new Vector(x, y);
        },

        updateVel: function(game, dt) {
            for (var key in game.everyone) {
                var ship = game.everyone[key];
                var frictionalForce = Physics.friction(ship);
                var sum = Physics.sumForces(ship.forces.concat([frictionalForce]));
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

    };

    return Physics;
});
