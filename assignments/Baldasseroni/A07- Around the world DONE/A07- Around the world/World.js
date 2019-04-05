// these global variables are used to contain the current angles of the world
var worldAngle = 0;
var worldElevation = 0;
var worldRoll = 0;

// this function returns the world matrix with the updated rotations.
// parameters rvx, rvy and rvz contains a value in the -1 .. +1 range that tells the angular velocity of the world.
function updateWorld(rvx, rvy, rvz) {
	// updates the angles
	worldAngle += toRad(rvy);
	worldElevation += toRad(rvx);
	worldRoll += toRad(rvz);

	// compute the rotation matrix with Euler angles
	/*var out =  utils.multiplyMatrices(utils.multiplyMatrices(
					utils.MakeRotateYMatrix(worldAngle),
					utils.MakeRotateXMatrix(worldElevation)),
					utils.MakeRotateZMatrix(worldRoll));		*/	 
    
    //define the terms of the rotation quaternion
    var rot_quat = Quaternion.fromEuler(worldRoll, worldElevation, worldAngle);
    var a = rot_quat.w;
    var b = rot_quat.x;
    var c = rot_quat.y;
    var d = rot_quat.z;
    var out = [1-2*c*c-2*d*d,   2*b*c + 2*a*d,  2*b*d - 2*a*c,  0.0,
              2*b*c - 2*a*d,    1-2*b*b-2*d*d,  2*c*d + 2*a*b,  0.0,
              2*b*d + 2*a*c,    2*c*d - 2*a*b,  1-2*b*b-2*c*c,  0.0,
              0.0,              0.0,            0.0,            1.0];

	return out;
}

function toRad(deg){
    return (deg*Math.PI)/180;
}
