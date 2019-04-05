function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz, aspectRatio) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, camdir contains the rotation about the y-axis to orient the car

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.

// The projection matrix is perspective projection matrix, with the aspect ratio written in parameter
// aspectRatio, a vertical Fov-y of 60 degrees, and with near and far planes repsectively at 0.1 and 1000.0

	var world = [1,0,0,0, 0,1,0,0, 0,0,1,-30, 0,0,0,1];
	var view  = [1,0,0,0, 0,1,0,-5, 0,0,1,10, 0,0,0,1];
	var projection = [1, 0, 0, 0,  0, 1.7, 0, 0,  0, 0, -1, -0.2,  0, 0, -1, 0];

	return [world, view, projection];
}

