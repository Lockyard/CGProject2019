function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz, aspectRatio) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, camdir contains the rotation about the y-axis to orient the car

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.

// The projection matrix is perspective projection matrix, with the aspect ratio written in parameter
// aspectRatio, a vertical Fov-y of 60 degrees, and with near and far planes repsectively at 0.1 and 1000.0

	var degToRad = Math.PI/180;
	cardir = cardir*degToRad;

	//WORLD MATRIX:  T*Ry*Rx*Rz*S, since only T and Ry happens, is T*Ry:
	//var world = [1,0,0,0, 0,1,0,0, 0,0,1,-30, 0,0,0,1];
	
	var carT= [1.0,		0.0,	0.0,	carx,
			   0.0,		1.0,	0.0,	cary,
			   0.0,		0.0,	1.0,	carz,
			   0.0,		0.0,	0.0,	1.0];
	
	var carRy= [Math.cos(cardir),	0.0,		Math.sin(cardir),	0.0,
			   0.0,					1.0,		0.0,				0.0,
			   -Math.sin(cardir),	0.0,		Math.cos(cardir),	0.0,
			   0.0,					0.0,		0.0,				1.0];
	
	var world = utils.multiplyMatrices(carT, carRy);
	
	//VIEW MATRIX: given by look at the car's position, from camera position.
	//vector z normalized: (c-a)/|c-a|, where a is the car position, c the camera's
	
	var u = [0, 1, 0];
	var caMod = Math.sqrt(Math.pow(camx-carx,2) + Math.pow(camy-cary,2) + Math.pow(camz-carz,2));
	
	var vz = [(camx-carx)/caMod, (camy-cary)/caMod, (camz-carz)/caMod];
	
	var uxvz = crossProduct3D(u,vz);
	
	var uxvzMod = Math.sqrt(Math.pow(uxvz[0], 2) + Math.pow(uxvz[1], 2) + Math.pow(uxvz[2], 2));
	
	var vx = [uxvz[0]/uxvzMod, uxvz[1]/uxvzMod, uxvz[2]/uxvzMod];
	
	var vy = crossProduct3D(vz, vx);
	
	//matrix camera: 	vx vy vz | C
	//					____________
	//						0	 | 1
	
	var Mc =  [vx[0],	vy[0],	vz[0],	camx,
			   vx[1],	vy[1],	vz[1],	camy,
			   vx[2],	vy[2],	vz[2],	camz,
			   0.0,		0.0,	0.0,	1.0];
	
	//view camera = Mc inverted
	var view  = utils.invertMatrix(Mc);
	
	
	//PROJECTION MATRIX:
	var fov = 60*degToRad;				//fov in radians
	var tgHalfFov = Math.tan(fov/2); //of tangent of theta / 2
	var n = 0.1;
	var f = 1000;
	
	var projection = 	[1/(aspectRatio*tgHalfFov),	0.0,			0.0,			0.0,
						0.0,						1/tgHalfFov,	0.0,			0.0,
						0.0,						0.0,			(f+n)/(n-f),	2*f*n/(n-f),
						0.0,						0.0,			-1,				1.0];

	return [world, view, projection];
}

//do the cross product of 2 vectors in 3D
function crossProduct3D(v1, v2) {
	return [ v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
}