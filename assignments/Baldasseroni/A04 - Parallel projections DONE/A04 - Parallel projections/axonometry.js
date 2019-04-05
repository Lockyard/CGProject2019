function axonometry() {
    var w = 40;
    var a = 16/9;
    var n = 1;
    var f = 101;
    var Proj =  [1/w,	0.0,		0.0,		0.0,
			   0.0,		a/w,		0.0,		0.0,
			   0.0,		0.0,		-2/(f-n),		-(f+n)/(f-n),
			   0.0,		0.0,		0.0,		1.0];
    var Ry =  [Math.cos(Math.PI/4),	0.0,		Math.sin(Math.PI/4),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(Math.PI/4),		0.0,		Math.cos(Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
	// Make an isometric view, w = 40, a = 16/9, n = 1, f = 101.
    var ISOrot_x =  [1.0,	0.0,		0.0,		0.0,
			   0.0,		Math.cos(utils.degToRad(35.26)),		-Math.sin(utils.degToRad(35.26)),		0.0,
			   0.0,		Math.sin(utils.degToRad(35.26)),		Math.cos(utils.degToRad(35.26)),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
	var A1 =  utils.multiplyMatrices(
                utils.multiplyMatrices(Proj, ISOrot_x),
                Ry
            );
			   
	// Make a dimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var DIMrot_x =  [1.0,	0.0,		0.0,		0.0,
			   0.0,		Math.cos(utils.degToRad(20)),		-Math.sin(utils.degToRad(20)),		0.0,
			   0.0,		Math.sin(utils.degToRad(20)),		Math.cos(utils.degToRad(20)),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
    var A2 =  utils.multiplyMatrices(
                utils.multiplyMatrices(Proj, DIMrot_x),
                Ry
            );
			   
	// Make a trimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis
    var TRIrot_y =  [Math.cos(Math.PI/6),	0.0,		Math.sin(Math.PI/6),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(Math.PI/6),		0.0,		Math.cos(Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var TRIrot_x =  [1.0,	0.0,		0.0,		0.0,
			   0.0,		Math.cos(utils.degToRad(-30)),		-Math.sin(utils.degToRad(-30)),		0.0,
			   0.0,		Math.sin(utils.degToRad(-30)),		Math.cos(utils.degToRad(-30)),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
	var A3 =  utils.multiplyMatrices(
                utils.multiplyMatrices(Proj, TRIrot_x),
                TRIrot_y
            );
			   
	// Make an cavalier projection view, w = 40, a = 16/9, n = 1, f = 101, at 45 degrees
	var CAV =  [1.0,	    0.0,		-Math.cos(Math.PI/4),		0.0,
			   0.0,		1.0,		-Math.sin(Math.PI/4),		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
    var O1 = utils.multiplyMatrices(Proj,CAV);

	// Make a cabinet projection view, w = 40, a = 16/9, n = 1, f = 101, at 60 degrees
	var CAB =  [1.0,    	0.0,		-0.5*Math.cos(Math.PI/3),		0.0,
			   0.0,		1.0,		-0.5*Math.sin(Math.PI/3),		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    
    var O2 = utils.multiplyMatrices(Proj,CAB);

	return [A1, A2, A3, O1, O2];
}

