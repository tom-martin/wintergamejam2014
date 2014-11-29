function Snow(scene) { 

    var perturb = function(factor) {
        return factor-(Math.random()*(factor*2));
    }
    var xMax = 100;
    var zMax = 100;

    var geom = new THREE.Geometry();
    var vertIndex = 0;

    var z = -(zMax/2);
    for(var zIndex = 0; zIndex < zMax; zIndex+=1) {
        var x = -(xMax/2);
        for(var xIndex = 0; xIndex < xMax; xIndex+=1) {

            geom.vertices.push(new THREE.Vector3(x+perturb(0.25), perturb(0.1), z+perturb(0.25)));
            
            if(zIndex > 0 && xIndex > 0) {
                geom.faces.push( new THREE.Face3( (vertIndex-xMax)-1, vertIndex-1, vertIndex-xMax));
                geom.faces.push( new THREE.Face3( vertIndex-xMax, vertIndex-1, vertIndex));
            }
            vertIndex+=1;
            x += 1
        }
        z +=1;
    }

    geom.computeFaceNormals();

    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    this.mesh = new THREE.Mesh( geom, material );
    scene.add(this.mesh);
}