var q0, q1, q2, q3, q01, q12, q23, q012, q123, bezierRes;

const ACOS_THRESHOLD = 0.9995;

const useFormula = false;
const useQuaternions = true;

function anim(cx, cy, cz, qx, qy, qz, qw, alpha) {
	// cx, cy, cz are arrays of four points
	// qx, qy, qz, qw are arrays of four quaternions
	// returns transform matrix with rotation and translation given
	// by Bezier interpolation of the input positions
	// according to parameter alpha (0 <= alpha <= 1)
	var x, y, z;

	//do position interpolation
	
	x = Bezier3(cx[0], cx[1], cx[2], cx[3], alpha, useFormula)
	y = Bezier3(cy[0], cy[1], cy[2], cy[3], alpha, useFormula)
	z = Bezier3(cz[0], cz[1], cz[2], cz[3], alpha, useFormula)

	var posMat = 	[1.0,	0.0,	0.0,	x,
					0.0,	1.0,	0.0,	y,
					0.0,	0.0,	1.0,	z,
					0.0,	0.0,	0.0,	1.0,]

	var rotMat;

	if(useQuaternions) {
		q0 = new Quaternion(qw[0], qx[0], qy[0], qz[0])
		q1 = new Quaternion(qw[1], qx[1], qy[1], qz[1])
		q2 = new Quaternion(qw[2], qx[2], qy[2], qz[2])
		q3 = new Quaternion(qw[3], qx[3], qy[3], qz[3])

		rotMat = BezierQuaternion(q0, q1, q2, q3, alpha).toMatrix4()
	} else {
		//Do interpolation of quaternions.
		//first extract the 4 quaternions
		q0 = [qw[0], qx[0], qy[0], qz[0]]
		q1 = [qw[1], qx[1], qy[1], qz[1]]
		q2 = [qw[2], qx[2], qy[2], qz[2]]
		q3 = [qw[3], qx[3], qy[3], qz[3]]

		//perform the slerp (or nlerp depending on which was chosen), and compute the final Bezier result
		var bezierRes = BezierQuaternionArray(q0, q1, q2, q3, alpha, slerp)

		//transform the 4 array to its quaternion, then to its matrix 4x4
		rotMat = new Quaternion(bezierRes).toMatrix4()
	}

	

	var out = utils.multiplyMatrices(posMat, rotMat);
	return out;
}


//spheric linear interpolation, based on formula, implemented with arrays
function slerp(q1, q2, alpha) {
	
	//theta = 2*arccos(a1a2+b1b2+c1c2+d1d2)
	let theta = 0;
	for (var i = 0; i < 4; i++) {
		theta += q1[i]*q2[i]
	}

	theta = 2*Math.acos(Math.min(ACOS_THRESHOLD, theta))

	//slerp = q1*sin((1-a)theta)/sin(theta) + q2*sin(a*theta)/sin(theta)
	let q12 = [];
	for (var i = 0; i < 4; i++) {
		q12[i] = q1[i]*Math.sin((1-alpha)*theta)/Math.sin(theta) + q2[i]*Math.sin(alpha*theta)/Math.sin(theta)
	}

	return q12;
}


//normalized linear interpolation, implemented with arrays
function nlerp(q1, q2, alpha) {
	let q12 = []
	for (var i = 0; i < 4; i++) {
		q12[i] = (1-alpha)*q1[i]+alpha*q2[i]
	}

	let modQ12 = Math.sqrt(Math.pow(q12[0],2)+Math.pow(q12[1],2)+Math.pow(q12[2],2)+Math.pow(q12[3],2))

	for (var i = 0; i < 4; i++) {
		q12[i] /= modQ12
	}

	return q12
}


function lerp(x1, x2, alpha) {
	return x1*(1-alpha) + x2*alpha
}


/**
*	Implementation of a Bezier of degree 3. Not generalized to N to keep simplicity wrt to this assignment.
*/
function Bezier3(x0, x1, x2, x3, alpha, useFormula) {
	if(useFormula) {
		return 	Math.pow((1-alpha),3)*x0	+	3*Math.pow((1-alpha), 2)*alpha*x1	+
				3*(1-alpha)*Math.pow(alpha, 2)*x2		+	Math.pow(alpha,3)*x3
	} else {
		let x01 = lerp(x0, x1, alpha)
		let x12 = lerp(x1, x2, alpha)
		let x23 = lerp(x2, x3, alpha)
		let x012 = lerp(x01, x12, alpha)
		let x123 = lerp(x12, x23, alpha)
		return lerp(x012, x123, alpha)
	}
	
}

//perform a Bezier curve calculation for quaternions implemented with simple arrays.
//xlerp is the function to use to do lerp, i.e. slerp or nlerp
function BezierQuaternionArray(q0, q1, q2, q3, alpha, xlerp) {

	var q01 = xlerp(q0,q1,alpha)
	var q12 = xlerp(q1,q2,alpha)
	var q23 = xlerp(q2,q3,alpha)
	var q012 = xlerp(q01,q12,alpha)
	var q123 = xlerp(q12,q23,alpha)
	return xlerp(q012,q123,alpha)

}

//performs a Bezier curve for quaternions using Quaternions objects
function BezierQuaternion(q0, q1, q2, q3, alpha) {
	var q01 = q0.slerp(q1)(alpha)
	var q12 = q1.slerp(q2)(alpha)
	var q23 = q2.slerp(q3)(alpha)
	var q012 = q01.slerp(q12)(alpha)
	var q123 = q12.slerp(q23)(alpha)
	return q012.slerp(q123)(alpha)
}