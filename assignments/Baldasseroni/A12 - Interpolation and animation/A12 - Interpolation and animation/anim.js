function anim(cx, cy, cz, qx, qy, qz, qw, alpha) {
	// cx, cy, cz are arrays of four points
	// qx, qy, qz, qw are arrays of four quaternions
	// returns transform matrix with rotation and translation given
	// by Bezier interpolation of the input positions
	// according to parameter alpha (0 <= alpha <= 1)
	const MAX_ACOS = 0.9999999;

	//bezier function for 0..3 points
	function bezier3(x0, x1, x2, x3, alpha){
		let bezPos1 = lerp(x0, x1, alpha);
		let bezPos2 = lerp(x1, x2, alpha);
		let bezPos3 = lerp(x2, x3, alpha);
		let bezPos4 = lerp(bezPos1, bezPos2, alpha);
		let bezPos5 = lerp(bezPos2, bezPos3, alpha);
		return lerp(bezPos4, bezPos5, alpha);
	}

	//linear interpolation
	function lerp(a,b,alpha){
		return a*(1-alpha) + b*alpha;
	}


	//position interpolation
	let bezX = bezier3(cx[0], cx[1], cx[2], cx[3], alpha);
	let bezY = bezier3(cy[0], cy[1], cy[2], cy[3], alpha);
	let bezZ = bezier3(cz[0], cz[1], cz[2], cz[3], alpha);

	//quaternion interpolation; slerp function is in the quaternion.min.js
    var q0 = new Quaternion(qw[0], qx[0], qy[0], qz[0]);
	var q1 = new Quaternion(qw[1], qx[1], qy[1], qz[1]);
	var q2 = new Quaternion(qw[2], qx[2], qy[2], qz[2]);
	var q3 = new Quaternion(qw[3], qx[3], qy[3], qz[3]);
    var q01 = q0.slerp(q1)(alpha);
	var q12 = q1.slerp(q2)(alpha);
	var q23 = q2.slerp(q3)(alpha);
	var q012 = q01.slerp(q12)(alpha);
	var q123 = q12.slerp(q23)(alpha);
	var qtot = q012.slerp(q123)(alpha);
	var rotation_mat = qtot.toMatrix4();

	var out =  utils.multiplyMatrices(utils.MakeTranslateMatrix(bezX, bezY, bezZ), rotation_mat);
	
	return out;
}

