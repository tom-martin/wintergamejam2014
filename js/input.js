function Input() {
	var self = this;

	this.forwardDown = false;
	this.backwardDown = false;
	this.leftDown = false;
	this.rightDown = false;

	this.onKeyChange = function(e, down) {
		if(e.keyCode==87) {
			self.forwardDown = down;
		}
		if(e.keyCode==83) {
			self.backwardDown = down;
		}
		if(e.keyCode==65) {
			self.leftDown = down;
		}
		if(e.keyCode==68) {
			self.rightDown = down;
		}
	}

	document.addEventListener("keydown", function(e) { self.onKeyChange(e, true); });
	document.addEventListener("keyup", function(e) { self.onKeyChange(e, false	); });

	var dir = new THREE.Vector2(0, 0);
	this.getDirection = function() {
		dir.set(0, 0);
		if(self.forwardDown) {
			dir.y = -1;
		}
		if(self.backwardDown) {
			dir.y = 1;
		}
		if(self.leftDown) {
			dir.x = -1;
		}
		if(self.rightDown) {
			dir.x = 1;
		}

		dir.normalize();

		return dir;
	}
}