function move() {
	// Rotate 30 degrees around an arbitrary axis passing through (1,1,0). The x-axis can be aligned to the arbitrary axis after a rotation of 15 degrees around the z-axis, and then 45 degrees around the y-axis.
    var R1z =  [Math.cos(Math.PI/12),		-Math.sin(Math.PI/12),		0.0,		0.0,
			   Math.sin(Math.PI/12),		Math.cos(Math.PI/12),		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var R1y =  [Math.cos(Math.PI/4),		0.0,		Math.sin(Math.PI/4),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(Math.PI/4),		0.0,		Math.cos(Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var R1x =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(Math.PI/6),		-Math.sin(Math.PI/6),		0.0,
			   0.0,		Math.sin(Math.PI/6),		Math.cos(Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var R1trans =  [1.0,		0.0,		0.0,		1.0,
			   0.0,		1.0,		0.0,		1.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var R1z_inv = utils.invertMatrix(R1z);
    var R1y_inv = utils.invertMatrix(R1y);
    var R1trans_inv = utils.invertMatrix(R1trans);
    
	var R1 =  utils.multiplyMatrices(
                utils.multiplyMatrices(
                    R1trans,
                    utils.multiplyMatrices(
                        utils.multiplyMatrices(R1z,R1y),
                        R1x)),
                utils.multiplyMatrices(
                    utils.multiplyMatrices(
                        R1y_inv,R1z_inv),
                    R1trans_inv
                )
            );
			   
	// Double the size of an object, using as fixed point (1,1,0)
	var S1 =  [2.0,		0.0,		0.0,		-1.0,
			   0.0,		2.0,		0.0,		-1.0,
			   0.0,		0.0,		2.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Mirror the starship along a plane passing through (1,2,0), and obtained rotating 38 degree around the y axis the xy plane
	var S2rot =  [Math.cos(utils.degToRad(38)),		0.0,		Math.sin(utils.degToRad(38)),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(utils.degToRad(38)),		0.0,		Math.cos(utils.degToRad(38)),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var S2trans =  [1.0,		0.0,		0.0,		1.0,
			   0.0,		1.0,		0.0,		2.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var S2mirror =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		-1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var S2 = utils.multiplyMatrices(
                utils.multiplyMatrices(
                    utils.multiplyMatrices(S2trans,S2rot),
                    S2mirror),
                utils.multiplyMatrices(utils.invertMatrix(S2rot),utils.invertMatrix(S2trans))
            );
			   
	// The ship has been doubled in size, rotated 45 degrees around the x axis, 30 degrees around the y axis, and moved to (1,1,-2). Return the ship in its original position
    var I1half =  [0.5,		0.0,		0.0,		0.0,
			   0.0,		0.5,		0.0,		0.0,
			   0.0,		0.0,		0.5,		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var I1rot_x =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(-Math.PI/4),		-Math.sin(-Math.PI/4),		0.0,
			   0.0,		Math.sin(-Math.PI/4),		Math.cos(-Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var I1rot_y =  [Math.cos(-Math.PI/6),		0.0,		Math.sin(-Math.PI/6),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(-Math.PI/6),		0.0,		Math.cos(-Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
    var I1trans =  [1.0,		0.0,		0.0,		-1.0,
			   0.0,		1.0,		0.0,		-1.0,
			   0.0,		0.0,		1.0,		2.0,
			   0.0,		0.0,		0.0,		1.0];
    
    var I1 =  utils.multiplyMatrices(
                utils.multiplyMatrices(
                    I1half, I1rot_x),
                utils.multiplyMatrices(I1rot_y,I1trans)
            );

	return [R1, S1, S2, I1];
}

