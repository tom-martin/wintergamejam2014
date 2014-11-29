function Snow(scene) { 

	var geom = new THREE.Geometry();
	var faceIndex = 0;

	geom.vertices.push(new THREE.Vector3(0, 0, 0));
	geom.vertices.push(new THREE.Vector3(0, 0, 1));
	geom.vertices.push(new THREE.Vector3(1, 0, 1));

	geom.faces.push( new THREE.Face3( 0, 1, 2));

	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    this.mesh = new THREE.Mesh( geom, material );
    scene.add(this.mesh);
}