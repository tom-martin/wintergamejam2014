function Ball(scene, startPosition, boundaryRectangle) {

    var self = this;

    var TurnSpeed = 10.0;
    var RotationSpeed = 75.0;
    var growRate = 0.5;
    var shrinkRate = 0.6;

    self.direction = new THREE.Vector3(0, 0, 1).normalize();
    self.yAxis = new THREE.Vector3(0, 1, 0).normalize();
    self.xAxis = new THREE.Vector3(1, 0, 0).normalize();
    self.speed = 20.0;
    self.mesh = createMesh(startPosition);

    self.yRotation = 0;
    self.xRotation = 0;

    scene.add(self.mesh);

    self.update = function(tick, input) {

        applyCollision();

        applyTurn(tick, input);

        applyMovement(tick);

        applyRotation(tick);
    };

    function createMesh(startPosition) {
        var sphereGeometry = new THREE.SphereGeometry( 0.5, 8, 8 );
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

    function applyCollision() {
        var position = new THREE.Vector2(self.mesh.position.x, self.mesh.position.z);

        if (!boundaryRectangle.containsPoint(position)) {
            if (self.mesh.position.x > boundaryRectangle.max.x) {
                self.mesh.position.x = boundaryRectangle.max.x - 1;
            }
            if (self.mesh.position.x < boundaryRectangle.min.x) {
                self.mesh.position.x = boundaryRectangle.min.x + 1;
            }
            if (self.mesh.position.z > boundaryRectangle.max.y) {
                self.mesh.position.z = boundaryRectangle.max.y - 1;
            }
            if (self.mesh.position.z < boundaryRectangle.min.y) {
                self.mesh.position.z = boundaryRectangle.min.y + 1;
            }

            self.yRotation += Math.PI;
        }
    }

    function applyRotation(tick) {
        self.xRotation += RotationSpeed*tick;

        self.mesh.rotation.set(0, 0, 0);
        self.mesh.rotateOnAxis( self.yAxis, self.yRotation );
        self.mesh.rotateOnAxis( self.xAxis, self.xRotation );
    }

    self.grow = function(tick) {
        self.mesh.scale.x += (growRate * tick);
        self.mesh.scale.y += (growRate * tick);
        self.mesh.scale.z += (growRate * tick);
    };

    self.shrink = function(tick) {
        self.mesh.scale.x -= (shrinkRate * tick);
        self.mesh.scale.y -= (shrinkRate * tick);
        self.mesh.scale.z -= (shrinkRate * tick);
    };

    return self;
}
