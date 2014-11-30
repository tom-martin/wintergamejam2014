function Weather() {
    var self = this;

    var TO_RADIANS = Math.PI / 180;

    var gravity = new THREE.Vector3(0,0,0);
    var velocity = -8
    var drag = 1;

    var mesh;

    function snowflake(x,y,z) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,0));
        geometry.faces.push(new THREE.Face3(0,2,1));

        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;

        return mesh;
    }

    var snowflakes = [];
    self.startSnowing = function(scene) {
        for (var i = 0; i < 10000; i++) {
            flake = snowflake(randomPoint(), randomPoint(), randomPoint())
            scene.add(flake);
            snowflakes.push(flake);
        }
    }

    function randomPoint() {
        return Math.random() * 400 - 300;
    }

    function recycle(snowflake) {
        snowflake.position.x = randomPoint();
        snowflake.position.y = randomPoint();
        snowflake.position.z = randomPoint();
    }

    self.update = function() {
        for (var i in snowflakes) {
            /* TODO: apply rotation, velocity, drag */
            var snowflake = snowflakes[i];

            snowflake.rotation.x += 0.01;
            if (snowflake.position.y < 0) {
                recycle(snowflake);
            } else {
                snowflake.position.y += velocity
            }
        }
    }

    function rand(min, max) {
        return ((Math.random() * (max-min)) + min)
    }
}