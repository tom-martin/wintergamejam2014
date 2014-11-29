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

camera.position.y = 15;



var render = function () {
  requestAnimationFrame( render );

  var input = undefined;

  camera.lookAt(snow.mesh.position);
  ball.update(input);

  renderer.render(scene, camera);
};

render();