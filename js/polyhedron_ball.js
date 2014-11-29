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

var verticesOfCube = [ -1,-1,-1,   1,-1,-1,   1, 1,-1,  -1, 1,-1,
                       -1,-1, 1,   1,-1, 1,   1, 1, 1,  -1, 1, 1 ];
var indicesOfFaces = [ 2,1,0, 0,3,2,
                       0,4,7, 7,3,0,
                       0,1,5, 5,4,0,
                       1,2,6, 6,5,1,
                       2,3,7, 7,6,2,
                       4,5,6, 6,7,4 ];
var geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 1, 3 );
var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  renderer.render(scene, camera);
};

render();
