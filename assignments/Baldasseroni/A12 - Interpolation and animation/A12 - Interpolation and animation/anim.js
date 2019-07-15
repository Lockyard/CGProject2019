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

	//spherical linear interpolation for quaternions
	function slerp(a, b, alpha){
		let theta = 0;
		for(i=0; i<4;i++){
			theta += a[i]*b[i];
		}
		theta = 2 * Math.acos(Math.min(MAX_ACOS, theta));

		let par1 = Math.sin((1-alpha)*theta)/Math.sin(theta);
		let par2 = Math.sin(alpha*theta)/Math.sin(theta);

		let res = [];
		for (var i = 0; i < 4; i++) {
			res[i] = a[i]*par1 + b[i]*par2;
		}

		return res;
	}


	//position interpolation
	let bezX = bezier3(cx[0], cx[1], cx[2], cx[3], alpha);
	let bezY = bezier3(cy[0], cy[1], cy[2], cy[3], alpha);
	let bezZ = bezier3(cz[0], cz[1], cz[2], cz[3], alpha);

	//quaternion interpolation
	var q0 = [qw[0], qx[0], qy[0], qz[0]];
	var q1 = [qw[1], qx[1], qy[1], qz[1]];
	var q2 = [qw[2], qx[2], qy[2], qz[2]];
	var q3 = [qw[3], qx[3], qy[3], qz[3]];

	let bezQuat1 = slerp(q0, q1, alpha);
	let bezQuat2 = slerp(q1, q2, alpha);
	let bezQuat3 = slerp(q2, q3, alpha);

	let bezQuat4 = slerp(bezQuat1, bezQuat2, alpha);
	let bezQuat5 = slerp(bezQuat2, bezQuat3, alpha);
	let bezQuat  = slerp(bezQuat4, bezQuat5, alpha);

	var out =  utils.multiplyMatrices(utils.MakeTranslateMatrix(bezX, bezY, bezZ), new Quaternion(bezQuat).toMatrix4());
	
	return out;
}

