function perspective(w, h, fov) {
	// Build a perspective projection matrix, for a viewport whose size is determined by parameters w (width) and h (height), and whose fov-y is passed in parameter fov. Near plane is n=0.1, and far plane f=100.
	var degToRad = Math.PI/180;
	var fovR = fov*degToRad;			//fov in radians
	var tgHalfFov = Math.tan(fovR/2); 	//of tangent of theta / 2
	var a = w/h;
	var n = 0.1;
	var f = 100;
	var out = [1/(a*tgHalfFov),		0.0,			0.0,			0.0,
			   0.0,					1/tgHalfFov,	0.0,			0.0,
			   0.0,					0.0,			(f+n)/(n-f),	2*f*n/(n-f),
			   0.0,					0.0,			-1,				1.0];

	return out;
}

