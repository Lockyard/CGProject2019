function view(cx, cy, cz, alpha, beta, rho) {
	// Create a view matrix for a camera in position cx, cy and cz, looking in the direction specified by
	// alpha, beta and rho, as outlined in the course slides.
    var rot_z = utils.MakeRotateZMatrix(-rho);
    var rot_x = utils.MakeRotateXMatrix(-beta);
    var rot_y = utils.MakeRotateYMatrix(-alpha);
    var trans = utils.MakeTranslateMatrix(-cx,-cy,-cz);
	var out =  utils.multiplyMatrices(
                    utils.multiplyMatrices(rot_z,rot_x),
                    utils.multiplyMatrices(rot_y,trans));
			   

	return out;
}

