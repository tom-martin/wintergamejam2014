var input1 = new Input(87, 83, 65, 68);
var input2 = new Input(38, 40, 37, 39);
var input3 = new Input(89, 72, 71, 74);
var input4 = new Input(80, 186, 76, 222);

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
var boundary = new THREE.Box2(new THREE.Vector2(-50, -50), new THREE.Vector2(50, 50));
var ball1 = new Ball(scene, new THREE.Vector3(20, 0, 0), boundary);
var ball2 = new Ball(scene, new THREE.Vector3(10, 0, 0), boundary);
var ball3 = new Ball(scene, new THREE.Vector3(-10, 0, 0), boundary);
var ball4 = new Ball(scene, new THREE.Vector3(-20, 0, 0), boundary);

var geometry = new THREE.PlaneBufferGeometry( 200, 200, 2 );
var floorTexture = THREE.ImageUtils.loadTexture('images/grass.png');
floorTexture.minFilter = THREE.NearestFilter;
floorTexture.magFilter = THREE.NearestFilter;
var material = new THREE.MeshLambertMaterial( {map: floorTexture} );
var plane = new THREE.Mesh( geometry, material );
plane.position.y = -5;
plane.rotation.set(-Math.PI/2, 0, 0);
scene.add( plane );

camera.position.y = 80;

var lastFrameTime = Date.now();
camera.lookAt(new THREE.Vector3(0, 0, 0.1));


var render = function () {
  stats.begin();

  var now = Date.now();
  var tick = Math.min(0.1, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  ball1.update(tick, input1);
  ball2.update(tick, input2);
  ball3.update(tick, input3);
  ball4.update(tick, input4);

  snow.update(tick, [ball1, ball2, ball3, ball4]);

  renderer.render(scene, camera);

  requestAnimationFrame( render );

  stats.end();
};

render();
