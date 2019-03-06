function move() {
	// Translate of +3 on the x axis, and -5 on the z axis
	var T1 =  [1.0,		0.0,		0.0,		3.0,	//translation of (3, 0, -5) 
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		-5.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Rotate of 30 degrees on the y axis (note: is -30 degrees)
	var R1 =  [Math.cos(-Math.PI/6),		0.0,		Math.sin(-Math.PI/6),		0.0, //rotation on y axis of -30 degrees
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(-Math.PI/6),		0.0,		Math.cos(-Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Make the starship 2 times bigger
	var S1 =  [2.0,		0.0,		0.0,		0.0, //scale of 2 on each axis
			   0.0,		2.0,		0.0,		0.0,
			   0.0,		0.0,		2.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Make the starship 1.5 times longer on the x axis, and half on the other axis
	var S2 =  [1.5,		0.0,		0.0,		0.0, //scale of 1.5 on x axis, 0.5 on others
			   0.0,		0.5,		0.0,		0.0,
			   0.0,		0.0,		0.5,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	// Mirror over the yz plane
	var S3 =  [-1.0,	0.0,		0.0,		0.0, //scale of -1 on the x axis
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Flatten over the zx plane
	var S4 =  [1.0,		0.0,		0.0,		0.0,	//scale of 0 on y axis
			   0.0,		0.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	// Make a shear along the x axis, with a factor of 1 along the y axis
	var H1 =  [1.0,		0.0,		0.0,		0.0,	//simple shear on x of 1 on y axis and 0 on z axis
			   1.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	return [T1, R1, S1, S2, S3, S4, H1];
}

//cos = Math.cos (arg is in radiants)

