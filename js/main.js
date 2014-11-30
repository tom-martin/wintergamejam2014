// var input1 = new Input(87, 83, 65, 68);
// var input2 = new Input(38, 40, 37, 39);
// var input3 = new Input(89, 72, 71, 74);
// var input4 = new Input(80, 186, 76, 222);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

var light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9);
directionalLight.position.set( -1, 1, 0 );
scene.add( directionalLight );

var snow = new Snow(scene);
var boundary = new THREE.Box2(new THREE.Vector2(-150, -100), new THREE.Vector2(150, 100));

var balls = [new Ball(scene, new THREE.Vector3(10, 0, 0), boundary, new Input(38, 40, 37, 39)),
			 new Ball(scene, new THREE.Vector3(20, 0, 0), boundary, new Input(87, 83, 65, 68))];

var geometry = new THREE.PlaneBufferGeometry( 512, 512, 2 );
var floorTexture = THREE.ImageUtils.loadTexture('images/back.png');
floorTexture.minFilter = THREE.NearestFilter;
floorTexture.magFilter = THREE.NearestFilter;
var material = new THREE.MeshLambertMaterial( {map: floorTexture} );
var plane = new THREE.Mesh( geometry, material );
plane.position.y = -0.5;
plane.rotation.set(-Math.PI/2, 0, 0);
scene.add( plane );

var x = boundary.min.x-15;
while(x < boundary.max.x+15) {
  var building = new Building(scene, x, boundary.min.y-20);
  x += (building.floorSize)+1;
}

x = boundary.min.x-15;
while(x < boundary.max.x+15) {
  var building = new Building(scene, x, boundary.max.y-10);
  x += (building.floorSize)+1;
}

var z = boundary.min.y-15;
while(z < boundary.max.y+15) {
  var building = new Building(scene, boundary.min.x-25, z);
  z += (building.floorSize)+1;
}

z = boundary.min.y-15;
while(z < boundary.max.y+15) {
  var building = new Building(scene, boundary.max.x-15, z);
  z += (building.floorSize)+1;
}

camera.position.y = 100;

var lastFrameTime = Date.now();
camera.lookAt(new THREE.Vector3(0, 0, 0.1));

var ballDiff = new THREE.Vector3();
var ballCentre = new THREE.Vector2();

var camBoundary = new THREE.Box2(new THREE.Vector2(-50, -50), new THREE.Vector2(50, 50));

var music = new Audio("../audio/music.ogg");
music.volume = 0.8;
music.play();

var render = function () {
  stats.begin();

  var now = Date.now();
  var tick = Math.min(0.2, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  camBoundary.min.set(10000, 10000);
  camBoundary.max.set(-10000, -10000);

  for(var ballI in balls) {
  	var ball = balls[ballI];

  	ball.update(now, tick, balls);

  	camBoundary.min.x = Math.min(ball.mesh.position.x, camBoundary.min.x);
  	camBoundary.min.y = Math.min(ball.mesh.position.z, camBoundary.min.y);

  	camBoundary.max.x = Math.max(ball.mesh.position.x, camBoundary.max.x);
  	camBoundary.max.y = Math.max(ball.mesh.position.z, camBoundary.max.y);
  }

  snow.update(tick, balls);

  ballDiff.x = camBoundary.max.x;
  ballDiff.z = camBoundary.max.y;
  ballDiff.x -= camBoundary.min.x;
  ballDiff.z -= camBoundary.min.y;

  camera.position.y = Math.max(30, Math.abs(ballDiff.length()));
  camera.position.y = Math.min(100, camera.position.y);

  camBoundary.center(ballCentre);

  camera.position.x = (ballCentre.x);
  camera.position.z = (ballCentre.y);

  renderer.render(scene, camera);

  requestAnimationFrame( render );

  stats.end();
};

render();
