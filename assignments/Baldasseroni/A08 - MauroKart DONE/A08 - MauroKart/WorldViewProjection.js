function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz, aspectRatio) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, camdir contains the rotation about the y-axis to orient the car    
    var rotyworld = utils.MakeRotateYMatrix(cardir);
    var transworld = utils.MakeTranslateMatrix(carx, cary, carz);
    
    var world = utils.multiplyMatrices(transworld, rotyworld);
    
// The camera is placed at position camx, camy and camz. The view matrix should be computed using the LookAt camera matrix procedure, with the correct up-vector.
    var vz_not_normalized = [(camx-carx), (camy-cary), (camz-carz)];
    var vz = utils.normalizeVector3(vz_not_normalized);
    var vx_not_normalized = utils.crossVector([0,1,0], vz);
    var vx = utils.normalizeVector3(vx_not_normalized);
    var vy = utils.crossVector(vz, vx);
    
    var camera = [vx[0],    vy[0],  vz[0],  camx,
                  vx[1],    vy[1],  vz[1],  camy,
                  vx[2],    vy[2],  vz[2],  camz,
                  0,        0,      0,      1    ];
    
	var view  = utils.invertMatrix(camera);
    
// The projection matrix is perspective projection matrix, with the aspect ratio written in parameter aspectRatio, a vertical Fov-y of 60 degrees, and with near and far planes repsectively at 0.1 and 1000.0
    var a = aspectRatio;
    var n = 0.1;
    var f = 1000.0;
    var fov = 60*Math.PI/180;
    
	var projection = [1.0/(a*Math.tan(fov/2)),		0.0,		0.0,		0.0,
                      0.0,		1.0/Math.tan(fov/2),		0.0,		0.0,
                      0.0,		0.0,		(f+n)/(n-f),		(2*f*n)/(n-f),
                      0.0,		0.0,		-1.0,		0.0];

    

	return [world, view, projection];
}

