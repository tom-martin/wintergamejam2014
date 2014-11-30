var windowTexture = THREE.ImageUtils.loadTexture('images/window.png');
windowTexture.minFilter = THREE.NearestFilter;
windowTexture.magFilter = THREE.NearestFilter;

var roofTexture = THREE.ImageUtils.loadTexture('images/roof.png');
roofTexture.minFilter = THREE.NearestFilter;
roofTexture.magFilter = THREE.NearestFilter;

function Building(scene, x, z) {
	var self = this;
	self.floorSize = 15+Math.floor(Math.random()*5);
	var height = 1+Math.floor(Math.random()*5);
	var xPlusWidth = x+self.floorSize+1;
	var zPlusWidth = z+self.floorSize;
	for(var i = 0; i < height; i++) {
		var geometry = new THREE.BoxGeometry( self.floorSize, self.floorSize, self.floorSize );
		var material = new THREE.MeshLambertMaterial( {map: windowTexture} );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		cube.position.x = xPlusWidth;
		cube.position.z = zPlusWidth;

		cube.position.y = (self.floorSize/2)+(i*self.floorSize);
	}

	var geometry = new THREE.PlaneBufferGeometry( self.floorSize, self.floorSize, 1);
	var material = new THREE.MeshLambertMaterial( {map: roofTexture} );
	var roof = new THREE.Mesh( geometry, material );
	roof.position.x = xPlusWidth;
	roof.position.z = zPlusWidth;

	roof.position.y = (height*self.floorSize)+0.1;
	roof.rotation.set(-Math.PI/2, 0, 0);
	scene.add(roof);
}