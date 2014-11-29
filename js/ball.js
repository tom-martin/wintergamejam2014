function Ball(scene) {

    var self = this;

    var sphereGeometry = new THREE.SphereGeometry( 0.5, 6, 6 );
    var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    self.mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add(this.mesh);

    this.update = function(tick, input) {
    	if(input.forwardDown) {
    		self.mesh.position.z += tick*10;
    	}
    	if(input.backwardDown) {
    		self.mesh.position.z -= tick*10;
    	}

    	if(input.leftDown) {
    		self.mesh.position.x += tick*10;
    	}
    	if(input.rightDown) {
    		self.mesh.position.x -= tick*10;
    	}

        self.mesh.rotation.x += 0.01;
        self.mesh.rotation.y += 0.01;
    }
}
