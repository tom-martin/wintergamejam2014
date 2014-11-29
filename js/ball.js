function Ball(scene, startPosition, boundaryRectangle, input) {

    var self = this;

    var Radius = 0.5;
    var TurnSpeed = 10.0;
    var RotationSpeed = 75.0;
    var growRate = 0.5;
    var shrinkRate = 0.6;

    var scale = 1.0;

    self.direction = new THREE.Vector3(0, 0, 1).normalize();
    self.yAxis = new THREE.Vector3(0, 1, 0).normalize();
    self.xAxis = new THREE.Vector3(1, 0, 0).normalize();
    self.speed = 20.0;
    self.mesh = createMesh(startPosition);

    self.yRotation = 0;
    self.xRotation = 0;

    scene.add(self.mesh);

    self.update = function(tick, otherBalls) {

        applyCollision(otherBalls);

        applyTurn(tick, input);

        applyMovement(tick);

        applyRotation(tick);

        applyScale();
    };

    function createMesh(startPosition) {
        var sphereGeometry = new THREE.SphereGeometry( Radius, 8, 8 );
        var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        var mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
        mesh.position.x += startPosition.x;
        mesh.position.y += startPosition.y;
        mesh.position.z += startPosition.z;
        return mesh;
    }

    function shouldTurnLeft(input) {
        return input.leftDown && !input.rightDown;
    }

    function shouldTurnRight(input) {
        return input.rightDown && !input.leftDown;
    }

    function movementVector(tick) {
        return new THREE.Vector2(self.direction.x * self.speed * tick, self.direction.z * self.speed * tick);
    }

    function applyMovement(tick) {
        var movement = movementVector(tick);
        self.mesh.position.x += movement.x;
        self.mesh.position.z += movement.y;
    }

    function applyTurn(tick, input) {

        self.direction = new THREE.Vector3(0, 0, 1);

        if (shouldTurnLeft(input)) {
            self.yRotation += (TurnSpeed * tick);
        }
        if (shouldTurnRight(input)) {
            self.yRotation -= (TurnSpeed * tick);
        }

        self.direction.applyAxisAngle(self.yAxis, self.yRotation);
    }

    function applyCollision(otherBalls) {
        var position = new THREE.Vector2(self.mesh.position.x, self.mesh.position.z);

        if (!boundaryRectangle.containsPoint(position)) {
            var newDirection = self.direction.clone();
            if (self.mesh.position.x > boundaryRectangle.max.x) {
                self.mesh.position.x = boundaryRectangle.max.x - 1;
                newDirection.x *= -1;
            }
            if (self.mesh.position.x < boundaryRectangle.min.x) {
                self.mesh.position.x = boundaryRectangle.min.x + 1;
                newDirection.x *= -1;
            }
            if (self.mesh.position.z > boundaryRectangle.max.y) {
                self.mesh.position.z = boundaryRectangle.max.y - 1;
                newDirection.z *= -1;
            }
            if (self.mesh.position.z < boundaryRectangle.min.y) {
                self.mesh.position.z = boundaryRectangle.min.y + 1;
                newDirection.z *= -1;
            }

            self.yRotation = Math.atan2(-newDirection.z, newDirection.x) + (0.5 * Math.PI);
        } else if (collidesWithAnyBall(otherBalls)) {
            self.yRotation += Math.PI;
        }
    }

    function collidesWithAnyBall(otherBalls) {
        return !otherBalls.every(function(ball) {
            return !collidesWithBall(ball);
        });
    }

    function collidesWithBall(otherBall) {
        return (otherBall != self) && (self.mesh.position.distanceTo(otherBall.mesh.position) < ((otherBall.mesh.scale.x * Radius) + (self.mesh.scale.x * Radius)));
    }

    function applyRotation(tick) {
        self.xRotation += RotationSpeed*tick;

        self.mesh.rotation.set(0, 0, 0);
        self.mesh.rotateOnAxis( self.yAxis, self.yRotation );
        self.mesh.rotateOnAxis( self.xAxis, self.xRotation );
    }

    function applyScale() {
        self.mesh.scale.set(scale, scale, scale);
    }

    self.grow = function(tick) {
        scale += (growRate * tick);
        scale += (growRate * tick);
        scale += (growRate * tick);
    };

    self.shrink = function(tick) {
        scale -= (shrinkRate * tick);
        scale -= (shrinkRate * tick);
        scale -= (shrinkRate * tick);
    };

    return self;
}
