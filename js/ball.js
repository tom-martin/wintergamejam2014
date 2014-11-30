function Ball(scene, startPosition, boundaryRectangle, input) {

    var self = this;

    var juiceSeed = Math.random()*10000;

    var Radius = 0.5;
    var TurnSpeed = 15.0;
    var RotationSpeed = 75.0;
    var growRate = 0.5;
    var shrinkRate = 1.0;

    self.isWinner = false;
    self.isLoser = false;

    var deathSounds = [new Audio("../audio/death1.ogg"), new Audio("../audio/death2.ogg")];
    var collideSounds = [new Audio("../audio/collide1.ogg"), new Audio("../audio/collide2.ogg"), new Audio("../audio/collide3.ogg")];

    var KillFactor = 2.0;
    var BounceFactor = 150.0;
    var SnowSwapFactor = 25.0;

    var MaxScale = 30;
    var MinScale = 1;

    var winnerBounceValue = 0;
    var WinnerBounceHeight = 10;
    var WinnerBounceSpeed = 5;
    var LoserFadeSpeed = 2.0;

    self.previousPosition = startPosition.clone();

    self.isAlive = true;
    var deadDirection = new THREE.Vector3(Math.random() * 2 - 1, 0.2, Math.random() * 2 - 1).normalize();

    self.scale = 1.0;

    self.direction = new THREE.Vector3(0, 0, 1).normalize();
    self.yAxis = new THREE.Vector3(0, 1, 0).normalize();
    self.xAxis = new THREE.Vector3(1, 0, 0).normalize();
    self.speed = 50.0;
    self.mesh = createMesh(startPosition);

    self.yRotation = 0;
    self.xRotation = 0;

    self.shrinking = false;
    self.previousShrinking = false;

    var white = new THREE.Color(0xffffff);
    var red = new THREE.Color(0xff0000);

    self.kill = function() {
        self.isAlive = false;
        self.isLoser = true;
        self.sphereMaterial.color = red;
        self.mesh.material = new THREE.MeshLambertMaterial( {color: 0xff0000} );
        Util.playRandomSound(deathSounds, 1.0);
        Game.inProgress = false;
    };

    self.update = function(now, tick, otherBalls, ballOffset) {
        if(self.shrinking && !self.previousShrinking) {
            self.shrinkingTime = now;
            self.previousShrinking = self.shrinking;
        } else {
            self.shrinking = false;
            self.previousShrinking = false;
        }
        if (self.isAlive) {
            applyCollision(otherBalls, ballOffset, tick);

            applyTurn(tick, input);

            applyMovement(tick);

            applyRotation(tick);
        } else {
            self.mesh.position.add(deadDirection.clone().multiplyScalar(tick * 80));
            self.grow(tick * 5);
        }

        applyScale();

        if(showShrinking(now)) {
            var colorBounce = Util.juiceBounce(now, juiceSeed, 1000, 1);
            self.sphereMaterial.color = new THREE.Color(1, colorBounce, colorBounce);
        } else {
            self.sphereMaterial.color = white;
        }
    };

    self.updatePostGame = function(tick) {
        if (self.isWinner) {
            self.sphereMaterial.color = white;
            winnerBounceValue += (tick * WinnerBounceSpeed);
            self.mesh.position.y = Math.abs(WinnerBounceHeight * Math.sin(winnerBounceValue));
        } else if (self.isLoser) {
            shrinkToNothing(tick * LoserFadeSpeed);
            applyScale();
        }
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

    function applyCollision(otherBalls, ballOffset, tick) {
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

        applyBallCollision(otherBalls, ballOffset, tick);
    }

    function applyBallCollision(otherBalls, ballOffset, tick) {
        for(var i = ballOffset; i < otherBalls.length; i++) {
            var otherBall = otherBalls[i];
            if (otherBall.isAlive) {
                if (collidesWithBall(otherBall)) {
                    if (self.scale > (otherBall.scale * KillFactor)) {
                        otherBall.kill();
                        self.isWinner = true;
                    } else if (otherBall.scale > (self.scale * KillFactor)) {
                        self.kill();
                        otherBall.isWinner = true;
                    } else { 
                        if (otherBall.scale > self.scale) {
                            self.shrink(tick * SnowSwapFactor);
                            otherBall.grow(tick * SnowSwapFactor);
                        } else if (otherBall.scale < self.scale) {
                            self.grow(tick * SnowSwapFactor);
                            otherBall.shrink(tick * SnowSwapFactor);
                        }
                        moveAwayFromOtherBall(otherBall, tick);
                        Util.playRandomSound(collideSounds, 1.0);
                    }
                }
            }
        }
        
            
    }

    function moveAwayFromOtherBall(otherBall, tick) {
        var directionVector = new THREE.Vector3(0,0,0)
            .subVectors(self.mesh.position, otherBall.mesh.position)
            .normalize()
            .multiplyScalar(BounceFactor * tick);

        self.mesh.position.add(directionVector)
        self.yRotation = Math.atan2(-directionVector.x, directionVector.z) + (0.5 * Math.PI);
        otherBall.yRotation = -self.yRotation;
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

    function applyScale() {
        self.mesh.scale.set(self.scale, self.scale, self.scale);
    }

    function showShrinking(now) {
        return self.shrinking || now - self.shrinkingTime < 500;
    }

    self.grow = function(tick) {
        self.scale = Math.min(MaxScale, self.scale + (growRate * tick));
    };

    self.shrink = function(tick) {
        self.scale = Math.max(MinScale, self.scale - (shrinkRate * tick));
    };

    function shrinkToNothing(tick) {
        self.scale = Math.max(0, self.scale - (shrinkRate * tick));
    }

    return self;
}
