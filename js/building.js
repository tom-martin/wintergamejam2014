var windowTexture = THREE.ImageUtils.loadTexture('images/window.png');
windowTexture.minFilter = THREE.NearestFilter;
windowTexture.magFilter = THREE.NearestFilter;

var windowTextureSnow = THREE.ImageUtils.loadTexture('images/windowSnow.png');
windowTextureSnow.minFilter = THREE.NearestFilter;
windowTextureSnow.magFilter = THREE.NearestFilter;

var windowTexture2 = THREE.ImageUtils.loadTexture('images/window2.png');
windowTexture2.minFilter = THREE.NearestFilter;
windowTexture2.magFilter = THREE.NearestFilter;

var windowTexture2Snow = THREE.ImageUtils.loadTexture('images/window2Snow.png');
windowTexture2Snow.minFilter = THREE.NearestFilter;
windowTexture2Snow.magFilter = THREE.NearestFilter;

var roofTexture = THREE.ImageUtils.loadTexture('images/roof.png');
roofTexture.minFilter = THREE.NearestFilter;
roofTexture.magFilter = THREE.NearestFilter;

function Building(scene, x, z) {
	var wt = windowTexture;
	var wtSnow = windowTextureSnow;
	if(Math.random() < 0.5) {
		wt = windowTexture2;
		wtSnow = windowTexture2Snow;
	}

	var self = this;
	self.floorSize = 15+Math.floor(Math.random()*5);
	var height = 1+Math.floor(Math.random()*5);
	var xPlusWidth = x+self.floorSize+1;
	var zPlusWidth = z+self.floorSize;
	var totalHeight = 0;
	var currentFloorSize = self.floorSize;

	var tex = wtSnow;
	for(var i = 0; i < height; i++) {

		if(i > 0 && Math.random() < 0.2) {
			currentFloorSize*=0.8;
			tex = wtSnow;
		}
		var geometry = new THREE.BoxGeometry( currentFloorSize, currentFloorSize, currentFloorSize );
		var material = new THREE.MeshLambertMaterial( {map: tex} );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		cube.position.x = xPlusWidth;
		cube.position.z = zPlusWidth;

		cube.position.y = (currentFloorSize/2)+totalHeight;
		totalHeight+= currentFloorSize;
		tex = wt;
	}

	var geometry = new THREE.PlaneBufferGeometry( currentFloorSize, currentFloorSize, 1);
	var material = new THREE.MeshLambertMaterial( {map: roofTexture} );
	var roof = new THREE.Mesh( geometry, material );
	roof.position.x = xPlusWidth;
	roof.position.z = zPlusWidth;

	roof.position.y = totalHeight+0.1;
	roof.rotation.set(-Math.PI/2, 0, 0);
	scene.add(roof);
}