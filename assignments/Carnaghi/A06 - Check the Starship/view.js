function view(cx, cy, cz, alpha, beta, rho) {
	// Create a view matrix for a camera in position cx, cy and cz, looking in the direction specified by
	// alpha, beta and rho, as outlined in the course slides.
	var degToRad = Math.PI/180;
	alpha = alpha*degToRad;
	beta = beta*degToRad;
	rho = rho*degToRad;
	
	//view matrix is inverse of camera matrix: is Rz(-rho)*Rx(-beta)*Ry(-alpha)*T(-cx, -cy, -cz)
	var T = 	[1.0,		0.0,		0.0,		-cx,
				0.0,		1.0,		0.0,		-cy,
				0.0,		0.0,		1.0,	    -cz,
				0.0,		0.0,		0.0,		1.0];
	
	var Ry =  [Math.cos(-alpha),	0.0,		Math.sin(-alpha),		0.0,
			   0.0,					1.0,		0.0,					0.0,
			   -Math.sin(-alpha),	0.0,		Math.cos(-alpha),		0.0,
			   0.0,					0.0,		0.0,					1.0];
	
	var Rx = [1.0,		0.0,				0.0,				0.0,
			  0.0,		Math.cos(-beta),	-Math.sin(-beta),	0.0,
			  0.0,		Math.sin(-beta),	Math.cos(-beta),	0.0,
			  0.0,		0.0,				0.0,				1.0];
			  
	var Rz = [Math.cos(-rho),	-Math.sin(-rho),		0.0,		0.0,
			  Math.sin(-rho),	Math.cos(-rho),			0.0,		0.0,
			  0.0,				0.0,					1.0,		0.0,
			  0.0,				0.0,					0.0,		1.0];
	
	//out = Rz*Rx*Ry*T
	var out =  utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(Rz, Rx), Ry), T);
			   

	return out;
}

