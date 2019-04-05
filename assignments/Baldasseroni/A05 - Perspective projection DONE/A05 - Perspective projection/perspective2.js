function perspective(w, h, fov) {
	// Build a perspective projection matrix, for a viewport whose size is determined by parameters w (width) and h (height), and whose fov-y is passed in parameter fov. Near plane is n=0.1, and far plane f=100.
    var a = w/h;
    var n = 0.1;
    var f = 100;
	var out = [1.0/(a*Math.tan(fov/2)),		0.0,		0.0,		0.0,
			   0.0,		1.0/Math.tan(fov/2),		0.0,		0.0,
			   0.0,		0.0,		(f+n)/(n-f),		(2*f*n)/(n-f),
			   0.0,		0.0,		-1.0,		0.0];

	return out;
}

