function Input() {
	var self = this;

	self.forwardDown = false;
	self.backwardDown = false;
	self.leftDown = false;
	self.rightDown = false;

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
	};

	document.addEventListener("keydown", function(e) { self.onKeyChange(e, true); });
	document.addEventListener("keyup", function(e) { self.onKeyChange(e, false	); });

	return self;
}