var input = new Input();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9);
directionalLight.position.set( -1, 1, 0 );
scene.add( directionalLight );

var snow = new Snow(scene);
var ball = new Ball(scene);

camera.position.y = 40;

var lastFrameTime = Date.now();
camera.lookAt(new THREE.Vector3(0, 0, 0.1));


var render = function () {
  var now = Date.now();
  var tick = Math.min(0.1, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  
  requestAnimationFrame( render );

  ball.update(tick, input);

  snow.update(ball.mesh.position, 2.0);

  renderer.render(scene, camera);
};

render();