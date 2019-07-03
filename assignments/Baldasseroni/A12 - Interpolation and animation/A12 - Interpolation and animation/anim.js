function anim(cx, cy, cz, qx, qy, qz, qw, alpha) {
	// cx, cy, cz are arrays of four points
	// qx, qy, qz, qw are arrays of four quaternions
	// returns transform matrix with rotation and translation given
	// by Bezier interpolation of the input positions
	// according to parameter alpha (0 <= alpha <= 1)
	
	var out =  utils.identityMatrix();
	
	return out;
}

