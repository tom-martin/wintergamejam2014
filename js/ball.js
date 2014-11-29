function Ball(scene) {

    var self = this;

    var sphereGeometry = new THREE.SphereGeometry( 5, 6, 6 );
    var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    self.mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add(this.mesh);

    this.update = function(input) {
        self.mesh.rotation.x += 0.01;
        self.mesh.rotation.y += 0.01;
    }
}
