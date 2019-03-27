function perspective() {
	// Build a perspective projection matrix, for a 16/9 viewport, with fov-y=90, near plane n=0.1, and far plane f=100.
	var degToRad = Math.PI/180;
	var fov = 90*degToRad;				//fov in radians
	var tgHalfFov = Math.tan(fov/2); //of tangent of theta / 2
	var a = 16/9;
	var n = 0.1;
	var f = 100;
	var t = n*tgHalfFov;
	var b = -n*tgHalfFov;
	
	//left is 0, right is doubled, for the right screen.
	var l = 0;
	var r = 2*a*n*tgHalfFov;
	
	var out = [2*n/(r-l),				0.0,			(r+l)/(r-l),			0.0,
			   0.0,					2*n/(t-b),		(t+b)/(t-b),			0.0,
			   0.0,					0.0,			(f+n)/(n-f),			2*f*n/(n-f),
			   0.0,					0.0,			-1,						0];

	return out;
}
