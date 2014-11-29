function Ball(scene) {

    var self = this;

    var TurnSpeed = 10.0;
    var RotationSpeed = 75.0;
    var growRate = 0.05;
    var shrinkRate = 0.1;

    self.direction = new THREE.Vector3(0, 0, 1).normalize();
    self.yAxis = new THREE.Vector3(0, 1, 0).normalize();
    self.xAxis = new THREE.Vector3(1, 0, 0).normalize();
    self.speed = 50.0;
    self.mesh = createMesh();

    self.yRotation = 0;
    self.xRotation = 0;

    scene.add(self.mesh);

    self.update = function(tick, input) {
        applyTurn(tick, input);

        applyMovement(tick);

        applyRotation(tick);
    };

    function createMesh() {
        var sphereGeometry = new THREE.SphereGeometry( 0.5, 8, 8 );
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

    function applyRotation(tick) {
        self.xRotation += RotationSpeed*tick;

        self.mesh.rotation.set(0, 0, 0);
        self.mesh.rotateOnAxis( self.yAxis, self.yRotation );
        self.mesh.rotateOnAxis( self.xAxis, self.xRotation );
    }

    self.grow = function() {
        self.mesh.scale.x += growRate;
        self.mesh.scale.y += growRate;
        self.mesh.scale.z += growRate;
    }

    self.shrink = function() {
        self.mesh.scale.x -= shrinkRate;
        self.mesh.scale.y -= shrinkRate;
        self.mesh.scale.z -= shrinkRate;
    }

    return self;
}
