// currP is the current p, which is the quaternion storing the current rotation
var currP = new Quaternion(); //p starts from 1 + 0i + 0j + 0k

// this function returns the world matrix with the updated rotations.
// parameters rvx, rvy and rvz contains a value in the -1 .. +1 range that tells the angular velocity of the world.
function updateWorld(rvx, rvy, rvz) {
	
	var degToRad = Math.PI/180;
	// updates the angles, converted in radians
	rvy = rvy*degToRad;
	rvx = rvx*degToRad;
	rvz = rvz*degToRad;
	
	//calculate the 3 quaternions used for x, y and z rotations
	var quatX = new Quaternion(Math.cos(rvx/2), Math.sin(rvx/2), 0, 0);
	var quatY = new Quaternion(Math.cos(rvy/2), 0, Math.sin(rvy/2), 0);
	var quatZ = new Quaternion(Math.cos(rvz/2), 0, 0, Math.sin(rvz/2));
	
	// p' = qx*qy*qz*p
	currP = quatX.mul(quatY.mul(quatZ.mul(currP)));

	//convert quaternion p in a matrix 4x4
	out = currP.toMatrix4();
	
	
	return out;
}
