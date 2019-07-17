function buildGeometry() {
	var i,j;

	function normal(vert1, vert2, vert3){
		var u = subVec3(vert1, vert2);
		var v = subVec3(vert2, vert3);
		return utils.normalizeVector3(utils.crossVector(u,v));
	}

	function subVec3(vec1, vec2){
		var result = [];
		result[0] = vec1[0] - vec2[0];
		result[1] = vec1[1] - vec2[1];
		result[2] = vec1[2] - vec2[2];
		return result;
	}

	/**********************CUBE****************************/
    var vert1 = [[-1.0,-1.0,-1.0], [1.0,-1.0,-1.0], [1.0,1.0,-1.0], [-1.0,1.0,-1.0], //0,1,2,3 iniziali = 0,1,2,3
				[1.0,1.0,-1.0], [1.0,1.0,1.0], [1.0,-1.0,1.0], [1.0,-1.0,-1.0], //2,6,5,1 = 4,5,6,7
				[-1.0,1.0,-1.0], [-1.0,1.0,1.0], [1.0,1.0,1.0], [1.0,1.0,-1.0], //3,7,6,2 = 8,9,10,11
				[-1.0,-1.0,-1.0], [-1.0,-1.0,1.0], [-1.0,1.0,1.0], [-1.0,1.0,-1.0], //0,4,7,3 = 12,13,14,15
				[1.0,-1.0,-1.0], [1.0,-1.0,1.0], [-1.0,-1.0,1.0], [-1.0,-1.0,-1.0], //1,5,4,0 = 16,17,18,19
				[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0]]; //4,5,6,7 iniziali = 20,21,22,23
	var ind1 = [0,3,1, 3,2,1,
		4,5,6, 4,6,7,
		8,9,10, 8,10,11,
		12,13,14,12,14,15,
		16,17,18, 16,18,19,
		20,21,22, 20,22,23];
	var color1 = [0.0, 0.0, 1.0];
	var norm1 = [[0.0,0.0,-1.0], [0.0,0.0,-1.0], [0.0,0.0,-1.0], [0.0,0.0,-1.0],
				[1.0,0.0,0.0], [1.0,0.0,0.0], [1.0,0.0,0.0], [1.0,0.0,0.0],
				[0.0,1.0,0.0], [0.0,1.0,0.0], [0.0,1.0,0.0], [0.0,1.0,0.0],
				[-1.0,0.0,0.0], [-1.0,0.0,0.0], [-1.0,0.0,0.0], [-1.0,0.0,0.0],
				[0.0,-1.0,0.0], [0.0,-1.0,0.0], [0.0,-1.0,0.0], [0.0,-1.0,0.0],
				[0.0,0.0,1.0], [0.0,0.0,1.0], [0.0,0.0,1.0], [0.0,0.0,1.0]];


	addMesh(vert1, norm1, ind1, color1);


	/*********************CYLINDER*************************/
	var ind2 = [];
	var color2 = [1.0, 0.0, 1.0];

	var slices2 = 64;
	var sliceAngle2 = 2*Math.PI / slices2;
	//indexes
	var lat_base1 = slices2 + 1;
	var lat_base2 = 2*slices2 + 1;
	var base2 = 3*slices2 + 1;
	var base2_center = 4*slices2 + 1;

	//bases' centers
	var vert2 = [[0.0, 0.0, 1.0]];
	var norm2 = [[0.0, 0.0, 1.0]];
    vert2[base2_center] = [0.0, 0.0, -1.0];
    norm2[base2_center] = [0.0, 0.0, -1.0];

    //generate all vertex values + bases' normal values
    for(i=0; i < slices2; i++){
		//base1 with base 1 normals
		vert2[i+1] = [Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), 1.0];
		norm2[i+1] = [0.0, 0.0, 1.0];

		ind2[3*i]   = 0;
		ind2[3*i+1] = i+1;
		ind2[3*i+2] = (i < slices2-1) ? i+2 : 1 ;

		//base1 with lateral normals
		vert2[i+lat_base1] = [Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), 1.0];
		norm2[i+lat_base1] = utils.normalizeVector3([Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), 0.0]);
		//base2 with lateral normals
		vert2[i+lat_base2] = [Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), -1.0];
		norm2[i+lat_base2] = utils.normalizeVector3([Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), 0.0]);

		ind2[3*(slices2+i)] = i+lat_base1;
		ind2[3*(slices2+i)+1] = i+lat_base2;
		ind2[3*(slices2+i)+2] = (i < slices2-1) ? i+lat_base1+1 : lat_base1;

		ind2[3*(2*slices2+i)] = i+lat_base2;
		ind2[3*(2*slices2+i)+1] = (i < slices2-1) ? i+lat_base2+1 : lat_base2;
		ind2[3*(2*slices2+i)+2] = (i < slices2-1) ? i+lat_base1+1 : lat_base1;

		//base2 with base normals
		vert2[i+base2] = [Math.cos(sliceAngle2 * i), Math.sin(sliceAngle2 * i), -1.0];
		norm2[i+base2] = [0.0, 0.0, -1.0];

		ind2[3*(3*slices2+i)] = base2_center;
		ind2[3*(3*slices2+i)+1] = (i < slices2-1) ? i+base2+1 : base2 ;
		ind2[3*(3*slices2+i)+2] = i+base2 ;
	}

	
	addMesh(vert2, norm2, ind2, color2);

	
	/**********************CONE****************************/
	var ind3 = [];
	var color3 = [1.0, 1.0, 0.0];
	var slices3 = 64;
	var sliceAngle3 = 2*Math.PI/slices3;
	var r3 = 1.0;
	var h3 = 2.0;

	//base center vertex
    var vert3 = [[0.0, 0.0, 0.0]];
    var norm3 = [[0.0, 0.0, 1.0]];
    var sideBaseIndex = slices3 + 1;
    var topVertIndex = 2*slices3 + 1;

	for(i = 0; i < slices3; i++) {
		//base with base normals
		vert3[i+1] = [Math.cos(sliceAngle3 * i), Math.sin(sliceAngle3 * i), 0.0];
		norm3[i+1] = [0.0, 0.0, 1.0];

		ind3[3*i]   = 0;
		ind3[3*i+1] = i+1;
		ind3[3*i+2] = (i < slices3-1) ? i+2 : 1 ;

		//base with lateral normals
		vert3[i+sideBaseIndex] = [Math.cos(sliceAngle3 * i), Math.sin(sliceAngle3 * i), 0.0];
		norm3[i+sideBaseIndex] = utils.normalizeVector3([Math.cos(sliceAngle3 * i), r3/h3, Math.sin(sliceAngle3*i)]);
		//top with lateral normals
		vert3[i+topVertIndex] = [0.0, 0.0, -2.0];
		norm3[i+topVertIndex] = utils.normalizeVector3([Math.cos(sliceAngle3 * i), r3/h3, Math.sin(sliceAngle3*i)]);

		ind3[3*(slices3+i)]   = i+topVertIndex;
		ind3[3*(slices3+i)+1] = (i < slices3-1) ? i+sideBaseIndex+1 : sideBaseIndex ;
		ind3[3*(slices3+i)+2] = i+sideBaseIndex ;
	}

	addMesh(vert3, norm3, ind3, color3);


	/**********************SPHERE***************************/
	var ind4 = [];
	var vert4 = [];
	var norm4 = [];
	var color4 = [0.0, 1.0, 1.0];
	var slices4 = 64;
	var angle = 2*Math.PI / slices4;

	for(i = 0; i < slices4; i++) {
        //top vertex with different normals
		vert4[i] = [0.0, 0.0, 0.0];

		var ring1normal = utils.normalizeVector3([Math.cos(angle * i), 1.0/0.25, Math.sin(angle*i)]);
		norm4[i] = ring1normal;

		vert4[i+slices4] = [Math.sin(angle * i), -Math.cos(angle * i), -0.25];
		vert4[i+2*slices4] = [1.8*Math.sin(angle * (i+0.5)), -1.8*Math.cos(angle * (i+0.5)), -1.25];

		var ring2normal = utils.normalizeVector3([1.8*Math.cos(angle * (i+0.5)), 1.8/1.0, 1.8*Math.sin(angle*(i+0.5))]);
		norm4[i+slices4] = [ring1normal[0], ring1normal[1], (ring1normal[2]+ring2normal[2])/2];
		norm4[i+2*slices4] = [ring2normal[0], ring2normal[1], (0.0+ring2normal[2])/2];

		ind4[3*i]   = i ;
		ind4[3*i+1] = i + slices4 ;
		ind4[3*i+2] = (i < slices4-1) ? i+slices4+1 : slices4 ;
        
		ind4[3*(slices4+i)] = i + slices4;
        ind4[3*(slices4+i)+1] = i + 2*slices4;
		ind4[3*(slices4+i)+2] = (i < slices4-1) ? i+slices4+1 : slices4 ;
        
        ind4[3*(2*slices4+i)] = (i < slices4-1) ? 2*slices4+i+1 : 2*slices4 ;
        ind4[3*(2*slices4+i)+1] = (i < slices4-1) ? i+slices4+1 : slices4 ;
        ind4[3*(2*slices4+i)+2] = 2*slices4 + i ;
        
        //middle band
        vert4[i+(slices4*3)] = [1.8*Math.sin(angle * (i+0.5)), -1.8*Math.cos(angle * (i+0.5)), -2.25];

		var ring3normal = utils.normalizeVector3([1.8*Math.cos(angle * (i+0.5)), 1.8/1.0, -1.8*Math.sin(angle*(i+0.5))]);
		norm4[i+(slices4*3)] = [ring3normal[0], ring3normal[1], (0.0+ring3normal[2])/2];

		ind4[3*(3*slices4+i)] = 2*slices4 + i ;
        ind4[3*(3*slices4+i)+1] = (i < slices4-1) ? 3*slices4+i+1 : 3*slices4 ;
        ind4[3*(3*slices4+i)+2] = (i < slices4-1) ? 2*slices4+i+1 : 2*slices4 ;
        
        ind4[3*(4*slices4+i)] = (i < slices4-1) ? 3*slices4+i+1 : 3*slices4 ;
        ind4[3*(4*slices4+i)+1] = 2*slices4 + i ;
        ind4[3*(4*slices4+i)+2] = 3*slices4 + i ;
        
        //lower half
        vert4[i+(slices4*4)] = [Math.sin(angle * i), -Math.cos(angle * i), -3.25];

        var ring4normal = utils.normalizeVector3([Math.cos(angle * i), 1.0/0.25, -Math.sin(angle*i)]);
		norm4[i+(slices4*4)] = [ring4normal[0], ring4normal[1], (ring3normal[2]+ring4normal[2])/2];

		//bottom vertices
		vert4[i+slices4*5] = [0.0, 0.0, -3.5];
		norm4[i+slices4*5] = ring4normal;

        ind4[3*(5*slices4+i)] = 3*slices4+i ;
        ind4[3*(5*slices4+i)+1] = 4*slices4+i ;
        ind4[3*(5*slices4+i)+2] = (i < slices4-1) ? 4*slices4+i+1 : 4*slices4 ;
        
        ind4[3*(6*slices4+i)] = (i < slices4-1) ? 4*slices4+i+1 : 4*slices4 ;
        ind4[3*(6*slices4+i)+1] = (i < slices4-1) ? 3*slices4+i+1 : 3*slices4 ;
        ind4[3*(6*slices4+i)+2] = 3*slices4 + i ;
            
        ind4[3*(7*slices4+i)] = 5*slices4+i ;
        ind4[3*(7*slices4+i)+1] = (i < slices4-1) ? 4*slices4+i+1 : 4*slices4 ;
        ind4[3*(7*slices4+i)+2] = 4*slices4+i ;
	}

	addMesh(vert4, norm4, ind4, color4);
}
