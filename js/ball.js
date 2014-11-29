function Ball(scene, startPosition, boundaryRectangle, input) {

    var self = this;

    var juiceSeed = Math.random()*10000;

    var Radius = 0.5;
    var TurnSpeed = 15.0;
    var RotationSpeed = 75.0;
    var growRate = 0.5;
    var shrinkRate = 1.0;

    var MaxScale = 30;

    self.previousPosition = startPosition.clone();

    self.scale = 1.0;

    self.direction = new THREE.Vector3(0, 0, 1).normalize();
    self.yAxis = new THREE.Vector3(0, 1, 0).normalize();
    self.xAxis = new THREE.Vector3(1, 0, 0).normalize();
    self.speed = 50.0;
    self.mesh = createMesh(startPosition);

    self.yRotation = 0;
    self.xRotation = 0;

    self.shrinking = false;

    scene.add(self.mesh);

    var white = new THREE.Color(0xffffff);


    self.update = function(now, tick, otherBalls) {

        applyCollision(otherBalls, tick);

        applyTurn(tick, input);

        applyMovement(tick);

        applyRotation(tick);

        applyScale(now);

        if(self.shrinking) {
            var colorBounce = Util.juiceBounce(now, juiceSeed, 750, (self.scale/2));
            self.sphereMaterial.color = new THREE.Color(1, colorBounce, colorBounce);
        } else {
            self.sphereMaterial.color = white;
        }

        clearFlags();
    };

    function createMesh(startPosition) {
        var sphereGeometry = new THREE.SphereGeometry( Radius, 8, 8 );
        self.sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        var mesh = new THREE.Mesh( sphereGeometry, self.sphereMaterial );
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
        self.previousPosition = self.mesh.position.clone();
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

    function applyCollision(otherBalls, tick) {
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
        }

        applyBallCollision(otherBalls, tick);
    }

    function applyBallCollision(otherBalls, tick) {
        otherBalls.forEach(function(otherBall) {
            if (otherBall != self) {
                if (collidesWithBall(otherBall)) {
                    if (otherBall.scale > self.scale) {
                        self.shrink(tick * 5);
                    } else if (otherBall.scale < self.scale) {
                        self.grow(tick * 5);
                    }
                }
            }
        });
    }

    function collidesWithBall(otherBall) {
        return self.mesh.position.distanceTo(otherBall.mesh.position) < ((otherBall.scale * Radius) + (self.scale * Radius));
    }

    function applyRotation(tick) {
        self.xRotation += RotationSpeed*tick;

        self.mesh.rotation.set(0, 0, 0);
        self.mesh.rotateOnAxis( self.yAxis, self.yRotation );
        self.mesh.rotateOnAxis( self.xAxis, self.xRotation );
    }

    function applyScale(now) {
        var growth = 0;
        if(!self.shrinking) {
            // growth = Util.juiceBounce(now, juiceSeed, 750, (self.scale/2));
        }
        var newScale = self.scale + growth;

        self.mesh.scale.set(newScale, newScale, newScale);
    }

    self.grow = function(tick) {
        self.scale = Math.min(MaxScale, self.scale + (growRate * tick));
    };

    self.shrink = function(tick) {
        self.shrinking = true;

        self.scale -= (shrinkRate * tick);
    };

    function clearFlags() {
        self.shrinking = false;
    }

    return self;
}
