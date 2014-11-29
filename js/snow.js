function Snow(scene) { 

    var self = this;

    var perturb = function(factor) {
        return factor-(Math.random()*(factor*2));
    }
    var xMax = 20;
    var zMax = 20;

    var geom = new THREE.Geometry();
    var vertIndex = 0;

    var faceReference = [];

    var z = (zMax/2);
    for(var zIndex = 0; zIndex < zMax; zIndex+=1) {
        var x = -(xMax/2);
        for(var xIndex = 0; xIndex < xMax; xIndex+=1) {

            geom.vertices.push(new THREE.Vector3(x+perturb(0.25), perturb(0.1), z+perturb(0.25)));
            
            if(zIndex > 0 && xIndex > 0) {
                geom.faces.push( new THREE.Face3( (vertIndex-xMax)-1, vertIndex-xMax, vertIndex-1));
                geom.faces.push( new THREE.Face3( vertIndex-1, vertIndex-xMax, vertIndex));
                faceReference[vertIndex]=geom.faces.length;
            }
            vertIndex+=1;
            x += 1
        }
        z -=1;
    }

    geom.computeFaceNormals();

    var materials = [
        new THREE.MeshLambertMaterial( { color: 0xffffff } ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.0 } )
    ];
    this.mesh = new THREE.Mesh( geom, new THREE.MeshFaceMaterial( materials ) );
    scene.add(this.mesh);

    this.hideFace = function(faceIndex) {
        if(faceIndex < geom.faces.length && geom.faces[faceIndex].materialIndex==0) {
            geom.faces[faceIndex].materialIndex = 1;
        }
    }

    this.hideFacesForVert = function(vertIndex) {
        // console.log(geom.vertices[vertIndex]);
        this.hideFace(faceReference[vertIndex]);
        this.hideFace(faceReference[vertIndex]-1);
        this.hideFace(faceReference[vertIndex]-2);

        this.hideFace(faceReference[vertIndex]-19);
        this.hideFace(faceReference[vertIndex]-18);
        this.hideFace(faceReference[vertIndex]-17);
    }

    this.update = function(ballPosition, ballWidth) {
        var diff = new THREE.Vector3(0, 0, 0);
        for(var vert in geom.vertices) {
            diff.copy(geom.vertices[vert]);
            diff.sub(ballPosition)
            var dist = Math.abs(diff.lengthSq());
            if(dist < ballWidth*ballWidth) {
                this.hideFacesForVert(vert);
            }
        }
    }

}