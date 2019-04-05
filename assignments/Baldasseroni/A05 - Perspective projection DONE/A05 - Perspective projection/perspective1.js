function perspective() {
	// Build a perspective projection matrix, for a 16/9 viewport, with fov-y=90, near plane n=0.1, and far plane f=100.
    var a = 16/9;
    var fov = 90;
    var n = 0.1;
    var f = 100;
	var out = [1.0/(a*Math.tan(fov/2)),		0.0,		0.0,		0.0,
			   0.0,		1.0/Math.tan(fov/2),		0.0,		0.0,
			   0.0,		0.0,		(f+n)/(n-f),		(2*f*n)/(n-f),
			   0.0,		0.0,		-1.0,		0.0];

	return out;
}

