var input1 = new Input(87, 83, 65, 68);
var input2 = new Input(38, 40, 37, 39);

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
var ball1 = new Ball(scene);
var ball2 = new Ball(scene);

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

  snow.update([ball1.mesh.position, ball2.mesh.position], 1.0);

  renderer.render(scene, camera);

  requestAnimationFrame( render );

  stats.end();
};

render();