function perspective() {
	// Build a perspective projection matrix, for a 16/9 viewport, with fov-y=90, near plane n=0.1, and far plane f=100.
	var degToRad = Math.PI/180;
	var fov = 90*degToRad;				//fov in radians
	var tgHalfFov = Math.tan(fov/2); //of tangent of theta / 2
	var a = 16/9;
	var n = 0.1;
	var f = 100;
	var out = [1/(a*tgHalfFov),		0.0,			0.0,			0.0,
			   0.0,					1/tgHalfFov,	0.0,			0.0,
			   0.0,					0.0,			(f+n)/(n-f),	2*f*n/(n-f),
			   0.0,					0.0,			-1,				1.0];

	return out;
}

