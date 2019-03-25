function axonometry() {
	
	var a = 16/9;
	var w = 40;
	var n = 1;
	var f = 101;
	
	var Port = [1/w,	0.0,		0.0,		0.0,			// 1/w
			   0.0,		a/w,		0.0,		0.0,			// a/w (ratio/halfwidth)
			   0.0,		0.0,		-2/(f-n),	-(f+n)/(f-n),	// -2/(f-n)	and  -(f+n)/(f+n)
			   0.0,		0.0,		0.0,		1.0];
	
	// Make an isometric view, w = 40, a = 16/9, n = 1, f = 101.
	var A1 =  utils.multiplyMatrices(utils.multiplyMatrices(Port, utils.MakeRotateXMatrix(35.26)), utils.MakeRotateYMatrix(45));
			   
	// Make a dimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var A2 =  utils.multiplyMatrices(utils.multiplyMatrices(Port, utils.MakeRotateXMatrix(20)), utils.MakeRotateYMatrix(45));
			   
	// Make a trimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis
	var A3 =  utils.multiplyMatrices(utils.multiplyMatrices(Port, utils.MakeRotateXMatrix(-30)), utils.MakeRotateYMatrix(30));
			   
	// Make an cavalier projection view, w = 40, a = 16/9, n = 1, f = 101, at 45 degrees
	var O1 =  utils.multiplyMatrices(Port, utils.MakeShearZMatrix(-Math.cos(Math.PI/4), -Math.sin(Math.PI/4)));	
	//shear on Z with rho = 1 and alpha = 45

	// Make a cabinet projection view, w = 40, a = 16/9, n = 1, f = 101, at 60 degrees
	var O2 =  utils.multiplyMatrices(Port, utils.MakeShearZMatrix(-0.5*Math.cos(Math.PI/3), -0.5*Math.sin(Math.PI/3)));	
	//shear on Z with rho = 0.5 and alpha = 60

	return [A1, A2, A3, O1, O2];
}

