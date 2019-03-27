
function move() {
//(1)///////////////////////////////////
	// Rotate 30 degrees around an arbitrary axis passing through (1,1,0). The x-axis can be aligned to the arbitrary axis after a rotation of 15 degrees around the z-axis, and then 45 degrees around the y-axis.
	//translation of (-1, -1, 0)
	var T_110 =  [1.0,	0.0,		0.0,		-1.0,
			   0.0,		1.0,		0.0,		-1.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//-15 degree on z axis
	var Rz_15 = [Math.cos(-Math.PI/12),	-Math.sin(-Math.PI/12),		0.0,		0.0,
			   Math.sin(-Math.PI/12),		Math.cos(-Math.PI/12),		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//-45 degree on y axis
	var Ry_45 = [Math.cos(-Math.PI/4),	0.0,		Math.sin(-Math.PI/4),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(-Math.PI/4),		0.0,		Math.cos(-Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//30 degree on x axis 
	var Rx30 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(Math.PI/6),		-Math.sin(Math.PI/6),		0.0,
			   0.0,		Math.sin(Math.PI/6),		Math.cos(Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//45 degree on y axis
	var Ry45 =  [Math.cos(Math.PI/4),	0.0,		Math.sin(Math.PI/4),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(Math.PI/4),		0.0,		Math.cos(Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//15 degree on z axis
	var Rz15 =  [Math.cos(Math.PI/12),	-Math.sin(Math.PI/12),		0.0,		0.0,
			   Math.sin(Math.PI/12),		Math.cos(Math.PI/12),		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//translation of (1,1,0)
	var T110 = [1.0,	0.0,		0.0,		1.0,
			   0.0,		1.0,		0.0,		1.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	
	//R1 = T110*Rz15*Ry45*Rx30*Ry_45*Rz_15*T_110
	var R1 =  utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(
				T110, Rz15), Ry45), Rx30), Ry_45), Rz_15), T_110);	

//(2)///////////////////////////////////////				
	// Double the size of an object, using as fixed point (1,1,0)
	
	//double size on each axis
	var S222 = [2.0,		0.0,		0.0,		0.0,
			   0.0,		2.0,		0.0,		0.0,
			   0.0,		0.0,		2.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	//reuse of T110 and T_110, the translation is the same
			   
	var S1 = utils.multiplyMatrices(utils.multiplyMatrices(T110, S222), T_110);
			   

//(3)//////////////////////////////////////////	
	// Mirror the starship along a plane passing through (1,2,0), and obtained rotating 38 degree around the y axis the xy plane
	
	var T_120=[1.0,		0.0,		0.0,		-1.0,
			   0.0,		1.0,		0.0,		-2.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	var deg = Math.PI/180;
	
	var Ry_38=[Math.cos(-deg*38),	0.0,		Math.sin(-deg*38),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(-deg*38),		0.0,		Math.cos(-deg*38),		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	//mirror on plane xy
	var MirXY = [1.0,		0.0,		0.0,		0.0,
				0.0,		1.0,		0.0,		0.0,
				0.0,		0.0,		-1.0,		0.0,
				0.0,		0.0,		0.0,		1.0];
	
	
	var Ry38=[Math.cos(deg*38),	0.0,		Math.sin(deg*38),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(deg*38),		0.0,		Math.cos(deg*38),		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	var T120 =[1.0,		0.0,		0.0,		1.0,
			   0.0,		1.0,		0.0,		2.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	//first translate of (-1,-2,0), then rotate of -38 deg on y axis, to align with target plane. Then mirror and reverse rotation and translation
	//note that is not necessary to translate also on y axis (a translation of (-1, 0, 0) and its reverse would be enough)
	var S2 = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(
				T120, Ry38), MirXY), Ry_38), T_120);
				
//(4)//////////////////////////////////////////////		   
	// The ship has been doubled in size, rotated 45 degrees around the x axis, 30 degrees around the y axis, and moved to (1,1,-2). Return the ship in its original position
	var T_11m2 = 	[1.0,		0.0,		0.0,		-1.0,
					0.0,		1.0,		0.0,		-1.0,
					0.0,		0.0,		1.0,		2.0,
					0.0,		0.0,		0.0,		1.0];
					
	var Ry_30 = [Math.cos(-Math.PI/6),	0.0,		Math.sin(-Math.PI/6),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(-Math.PI/6),		0.0,		Math.cos(-Math.PI/6),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	var Rx_45 = [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(-Math.PI/4),		-Math.sin(-Math.PI/4),		0.0,
			   0.0,		Math.sin(-Math.PI/4),		Math.cos(-Math.PI/4),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	var S_222 = 	[0.5,		0.0,		0.0,		0.0,
					0.0,		0.5,		0.0,		0.0,
					0.0,		0.0,		0.5,		0.0,
					0.0,		0.0,		0.0,		1.0];
	
	var I1 = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(S_222, Rx_45), Ry_30), T_11m2);

	return [R1, S1, S2, I1];
}

