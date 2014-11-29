function Input(upKey, downKey, leftKey, rightKey) {
	var self = this;

	self.forwardDown = false;
	self.backwardDown = false;
	self.leftDown = false;
	self.rightDown = false;

	this.onKeyChange = function(e, down) {

		if(e.keyCode==upKey) {
			self.forwardDown = down;
		}
		if(e.keyCode==downKey) {
			self.backwardDown = down;
		}
		if(e.keyCode==leftKey) {
			self.leftDown = down;
		}
		if(e.keyCode==rightKey) {
			self.rightDown = down;
		}
	};

	document.addEventListener("keydown", function(e) { self.onKeyChange(e, true); });
	document.addEventListener("keyup", function(e) { self.onKeyChange(e, false	); });

	return self;
}