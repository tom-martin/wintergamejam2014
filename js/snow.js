function Snow(scene) {

    var self = this;

    var perturb = function(factor) {
		return factor - (Math.random() * (factor * 2));
	};
    var xMax = 300;
    var zMax = 200;

    var geom = new THREE.Geometry();
    var vertIndex = 0;

    var faceReference = [];

    var z = (zMax/2);
    for(var zIndex = 0; zIndex < zMax; zIndex+=1) {
        var x = -(xMax/2);
        for(var xIndex = 0; xIndex < xMax; xIndex+=1) {

            geom.vertices.push(new THREE.Vector3(x+perturb(0.25), perturb(0.25), z+perturb(0.25)));

            var texMinX = 0.0;
            var texMaxX = 0.5;
            var texMinY = 0.5;
            var texMaxY = 1.0;

            if(zIndex > 0 && xIndex > 0) {
                geom.faces.push( new THREE.Face3( (vertIndex-xMax)-1, vertIndex-xMax, vertIndex-1));
                geom.faceVertexUvs[0].push([new THREE.Vector2(texMinX,texMinY),new THREE.Vector2(texMinX,texMaxY),new THREE.Vector2(texMaxX,texMinY)]);

                geom.faces.push( new THREE.Face3( vertIndex-1, vertIndex-xMax, vertIndex));
                geom.faceVertexUvs[0].push([new THREE.Vector2(texMaxX,texMinY),new THREE.Vector2(texMinX,texMaxY),new THREE.Vector2(texMaxX,texMaxY)]);

                faceReference[vertIndex]=geom.faces.length;
            }
            vertIndex+=1;
            x += 1
        }
        z -=1;
    }

    var texture = THREE.ImageUtils.loadTexture('images/snow.png');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    geom.computeFaceNormals();
    self.mesh = new THREE.Mesh( geom, new THREE.MeshLambertMaterial( {
        map: texture,
        transparent: true
    } ) );
    scene.add(self.mesh);

    self.showFace = function(faceIndex) {
        if(faceIndex < geom.faceVertexUvs[0].length) {
            var faceUvs = geom.faceVertexUvs[0][faceIndex];
            if(faceIndex % 2 == 0) {
                faceUvs[0].x = 0.0;
                faceUvs[0].y = 0.5;

                faceUvs[1].x = 0.0;
                faceUvs[1].y = 1.0;

                faceUvs[2].x = 0.5;
                faceUvs[2].y = 1.0;
            } else {
                faceUvs[0].x = 0.5;
                faceUvs[0].y = 0.5;

                faceUvs[1].x = 0.0;
                faceUvs[1].y = 1.0;

                faceUvs[2].x = 0.5;
                faceUvs[2].y = 1.0;
            }
            geom.uvsNeedUpdate = true;
        }
    };

    self.hideFace = function(faceIndex) {
        if(faceIndex < geom.faceVertexUvs[0].length) {
            var faceUvs = geom.faceVertexUvs[0][faceIndex];
            if(faceIndex % 2 == 0) {
                faceUvs[0].x = 0.5;
                faceUvs[0].y = 0.0;

                faceUvs[1].x = 0.5;
                faceUvs[1].y = 0.5;

                faceUvs[2].x = 1.0;
                faceUvs[2].y = 0.0;
            } else {
                faceUvs[0].x = 1.0;
                faceUvs[0].y = 0.0;

                faceUvs[1].x = 0.5;
                faceUvs[1].y = 0.5;

                faceUvs[2].x = 1.0;
                faceUvs[2].y = 0.5;
            }
            geom.uvsNeedUpdate = true;
        }
    };

    var clearedSnow = [];
    self.hideFacesForVert = function(vertIndex) {
        clearedSnow[vertIndex] = true;
        self.hideFace(faceReference[vertIndex]);
        self.hideFace(faceReference[vertIndex]+1);
    };

    self.showFacesForVert = function(vertIndex) {
        clearedSnow[vertIndex] = false;
        self.showFace(faceReference[vertIndex]);
        self.showFace(faceReference[vertIndex]+1);
    };

    self.update = function(tick, balls) {
        for(var i = 0.05; i < tick*100; i+=0.05) {
            var randomVert = Math.floor(Math.random()*geom.vertices.length);
            self.showFacesForVert(randomVert);
        }

        var diff = new THREE.Vector3(0, 0, 0);
        for (var ballIndex in balls) {
            var ball = balls[ballIndex]
            var ballPosition = ball.mesh.position;
            var ballWidth = getBallWidth(ball);

            var chunkSpaceX = Math.floor(ballPosition.x)+(xMax/2);
            var startingVert = Math.max(0, chunkSpaceX%xMax-5);

            for(var currentRow = startingVert; currentRow < geom.vertices.length; currentRow+=xMax) {
                for(var vertIndex = currentRow; (vertIndex < (currentRow+10) && vertIndex < geom.vertices.length); vertIndex++) {
                    diff.copy(geom.vertices[vertIndex]);
                    diff.sub(ballPosition);
                    var dist = Math.abs(diff.lengthSq());
                    if(dist < ballWidth*ballWidth) {
                        if (!clearedSnow[vertIndex]) {
                            self.hideFacesForVert(vertIndex);
                            ball.grow(tick);

                        } else {
                            diff.copy(geom.vertices[vertIndex]);
                            diff.sub(ball.previousPosition)
                            dist = Math.abs(diff.lengthSq());

                            if (dist > ballWidth*ballWidth) {
                                shrinkFound = true;
                                ball.shrink(tick);
                            }
                        }
                    }
                }
            }

            var newBallWidth = getBallWidth(ball);
            if(newBallWidth < ballWidth) {
                ball.shrinking = true;
            } else {
                ball.shrinking = false;
            }

        }
    };

    function getBallWidth(ball) {
        var ballScale = ball.scale;
        return (ballScale * ball.mesh.geometry.boundingSphere.radius)
    }
}
