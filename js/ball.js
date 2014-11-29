function Ball(scene) {

    var TurnSpeed = 1.0;

    var self = this;

    var sphereGeometry = new THREE.SphereGeometry( 0.5, 6, 6 );
    var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    self.mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add(this.mesh);

    self.update = function(tick, input) {
        applyTurn(tick, input);

        applyMovement(tick);

        applyAestheticRotation();
    };

    self.direction = new THREE.Vector2(0.0, 1.0);
    self.speed = 2.0;

    function shouldTurnLeft(input) {
        return input.leftDown && !input.rightDown;
    }

    function shouldTurnRight(input) {
        return input.rightDown && !input.leftDown;
    }

    function applyMovement(tick) {
        self.mesh.translateX(self.direction.x * self.speed * tick);
        self.mesh.translateZ(self.direction.y * self.speed * tick);
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

    function applyAestheticRotation() {
        self.mesh.rotation.x += 0.01;
        self.mesh.rotation.y += 0.01;
    }
}
