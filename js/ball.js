function Ball(scene) {

    var self = this;

    var TurnSpeed = 1.0;
    var RotationSpeed = 0.5;

    self.direction = new THREE.Vector2(1, 1).normalize();
    self.speed = 2.0;
    self.mesh = createMesh();

    scene.add(this.mesh);

    self.update = function(tick, input) {
        applyTurn(tick, input);

        applyMovement(tick);

        applyAestheticRotation(tick);
    };

    function createMesh() {
        var sphereGeometry = new THREE.SphereGeometry( 5, 8, 8 );
        var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        return new THREE.Mesh( sphereGeometry, sphereMaterial );
    }

    function shouldTurnLeft(input) {
        return input.leftDown && !input.rightDown;
    }

    function shouldTurnRight(input) {
        return input.rightDown && !input.leftDown;
    }

    function movementVector(tick) {
        return new THREE.Vector2(self.direction.x * self.speed * tick, self.direction.y * self.speed * tick);
    }

    function applyMovement(tick) {
        var movement = movementVector(tick);
        self.mesh.position.x += movement.x;
        self.mesh.position.z += movement.y;
    }

    function applyTurn(tick, input) {

        var zAxis = new THREE.Vector3(0, 0, 1);
        var vector3 = new THREE.Vector3(self.direction.x, self.direction.y, 0);

        if (shouldTurnLeft(input)) {
            vector3.applyAxisAngle(zAxis, -(TurnSpeed * tick));
        }
        if (shouldTurnRight(input)) {
            vector3.applyAxisAngle(zAxis, (TurnSpeed * tick));
        }

        self.direction = new THREE.Vector2(vector3.x, vector3.y);
    }

    function applyAestheticRotation(tick) {

        var axis = new THREE.Vector3(0,1,0).cross(new THREE.Vector3(self.direction.x, 0, self.direction.y));
        self.mesh.rotateOnAxis( axis, RotationSpeed * tick );
    }
}
