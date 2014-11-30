function Weather(boundary) {
    var self = this;

    var velocity = -4;
    var drag = 1;

    function snowflake(x,y,z) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,0));
        geometry.faces.push(new THREE.Face3(0,2,1));

        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;

        return mesh;
    }

    var snowflakes = [];
    self.startSnowing = function(scene) {
        for (var i = 0; i < 1000; i++) {
            flake = snowflake(randomPointX(), randomPointY(), randomPointZ())
            scene.add(flake);
            snowflakes.push(flake);
        }
    }

    function randomPointX() {
        return boundary.min.x + (Math.random() * (boundary.max.x - boundary.min.x));
    }

    function randomPointY() {
        return rand(10, 100);
    }

    function randomPointZ() {
        return boundary.min.y + (Math.random() * (boundary.max.y - boundary.min.y));
    }

    function recycle(snowflake) {
        snowflake.position.x = randomPointX();
        snowflake.position.y = randomPointY();
        snowflake.position.z = randomPointZ();
    }

    self.update = function(tick) {
        for(var i=0; i < 1000; i++) {
            /* TODO: apply drag */
            var snowflake = snowflakes[i%snowflakes.length];

            snowflake.rotation.x += 0.01;
            snowflake.rotation.y += 0.01;
            if (snowflake.position.y < 0) {
                recycle(snowflake);
            } else {
                snowflake.position.y += applyDrag(velocity) * tick;
            }
        }
    }

    function applyDrag(velocity) {
        return velocity - rand(0, drag);
    }

    function rand(min, max) {
        return ((Math.random() * (max-min)) + min)
    }
}
