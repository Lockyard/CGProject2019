function buildGeometry() {
	var i;

	let rad2 = 1/Math.sqrt(2);
	//module of a vector, to normalize it. Changed at each geometry
	let mod;
	
	// Draws a cube

	var vert1 = [[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0], 		//front face
				[-1.0,-1.0,-1.0], [1.0,-1.0,-1.0], [1.0,1.0,-1.0], [-1.0,1.0,-1.0], 	//back face
				[1.0,1.0,1.0], [1.0,-1.0,1.0], [1.0,-1.0,-1.0], [1.0,1.0,-1.0],			//right face
				[-1.0,1.0,1.0], [-1.0,-1.0,1.0], [-1.0,-1.0,-1.0], [-1.0,1.0,-1.0],		//left face
				[-1.0,1.0,-1.0], [-1.0,1.0,1.0], [1.0,1.0,1.0], [1.0,1.0,-1.0],			//top face
				[-1.0,-1.0,-1.0], [-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,-1.0,-1.0]];	//bottom face
	var ind1 = [0,1,2,		0,2,3,  	5,4,7,		5,7,6,		8,9,10,		8,10,11,
				13,15,14,  	13,12,15,	16,17,18,	16,18,19,	20,22,21,	20,23,22];
	var norm1 = [[0.0,0.0,1.0],	[0.0,0.0,1.0],	[0.0,0.0,1.0],	[0.0,0.0,1.0],		//front face
				 [0.0,0.0,-1.0],[0.0,0.0,-1.0],	[0.0,0.0,-1.0],	[0.0,0.0,-1.0],		//back
				 [1.0,0.0,0.0],	[1.0,0.0,0.0],	[1.0,0.0,0.0],	[1.0,0.0,0.0],		//right
				 [-1.0,0.0,0.0],[-1.0,0.0,0.0],	[-1.0,0.0,0.0],	[-1.0,0.0,0.0],		//left
				 [0.0,1.0,0.0],	[0.0,1.0,0.0],	[0.0,1.0,0.0],	[0.0,1.0,0.0],		//top
				 [0.0,-1.0,0.0],[0.0,-1.0,0.0],	[0.0,-1.0,0.0],	[0.0,-1.0,0.0],];	//bottom

	var color1 = [0.0, 0.0, 1.0];

	addMesh(vert1, norm1, ind1, color1);
	
	// Draws a Cylinder
	mod = Math.sqrt(2);

	var vert2 = [[0.0, 0.0, 1.5]];
	var norm2 = [[0.0, 0.0, 1.0]];
	var ind2 = [];
	var color2 = [1.0, 0.0, 1.0];
	var slices2 = 8;

	var backCenter = slices2+1;
	var sidesOffset = backCenter*2;

	vert2[backCenter] = [0.0, 0.0, -1.5];
	norm2[backCenter] = [0.0, 0.0, -1.0];

	//norm2[i+1] = [Math.cos(2*Math.PI / slices2 * i), Math.sin(2*Math.PI / slices2 * i), 1.0];

	for(i = 0; i < slices2; i++) {
		//front circle
		vert2[i+1] = [Math.cos(2*Math.PI / slices2 * i), Math.sin(2*Math.PI / slices2 * i), 1.5];
		norm2[i+1] = [0.0, 0.0, 1.0];
		ind2[3*i]   = 0;
		ind2[3*i+1] = i+1;
		ind2[3*i+2] = (i < slices2-1) ? i+2 : 1 ;
		
		//back circle, based on front circle
		vert2[backCenter+i+1] = [vert2[i+1][0], 	vert2[i+1][1], 		-1.5];
		norm2[backCenter+i+1] = [0.0, 0.0, -1.0];
		ind2[3*(backCenter+i)]   = backCenter;
		ind2[3*(backCenter+i)+1] = backCenter + ((i < slices2-1) ? i+2 : 1);
		ind2[3*(backCenter+i)+2] = backCenter + i+1;
		
		//sides
		//front circle for side
		vert2[sidesOffset+i] = vert2[i+1];
		norm2[sidesOffset+i] = [Math.cos(2*Math.PI / slices2 * i), Math.sin(2*Math.PI / slices2 * i), 0.0];
		//back circle for side
		vert2[sidesOffset+slices2+i] = vert2[backCenter+i+1];
		norm2[sidesOffset+slices2+i] = [Math.cos(2*Math.PI / slices2 * i), Math.sin(2*Math.PI / slices2 * i), 0.0];
		//first triangle

		ind2[3*(sidesOffset+i*2)] 	=	sidesOffset + i;
		ind2[3*(sidesOffset+i*2)+1] =	sidesOffset + i + slices2;
		ind2[3*(sidesOffset+i*2)+2] =	(i < slices2-1) ? sidesOffset + i + 1 : sidesOffset;
		//second triangle
		ind2[3*(sidesOffset+i*2)+3] =	(i < slices2-1) ? sidesOffset + i + 1 : sidesOffset;
		ind2[3*(sidesOffset+i*2)+4] =	sidesOffset + i + slices2;
		ind2[3*(sidesOffset+i*2)+5] =	(i < slices2-1) ? (sidesOffset + i + slices2 + 1) : (sidesOffset + slices2);
	}

	addMesh(vert2, norm2, ind2, color2);

	
	// Draws a Cone
	/*/
	var vert3 = [[0.0, 0.0, 0.0]];
	var norm3 = [[0.0, 0.0, 1.0]];
	var ind3 = [];
	var color3 = [1.0, 1.0, 0.0];
	var slices3 = 64;
	for(i = 0; i < slices3; i++) {
		vert3[i+1] = [Math.cos(2*Math.PI / slices3 * i), Math.sin(2*Math.PI / slices3 * i), 0.0];
		norm3[i+1] = [Math.cos(2*Math.PI / slices3 * i), Math.sin(2*Math.PI / slices3 * i), 1.0];
		ind3[3*i]   = 0;
		ind3[3*i+1] = i+1;
		ind3[3*i+2] = (i < slices3-1) ? i+2 : 1 ;
	}//*/
	//first: bottom center point. Next slices3 points are the base. Then slices3 other points for lateral base circle.
	//finally other slices3 points in the top point of the cone
	//[baseCircle, 	lateralCircle, 	allTopPoints,	p0]
	//[slices3, 	slices3, 		slices3,		1]
	var vert3 = [];
	var norm3 = [];
	var ind3 = [];
	var color3 = [1.0, 1.0, 0.0];
	var slices3 = 16;
	let latIndex = slices3;
	let topIndex = slices3*2;
	let botIndex = slices3*3;
	let bottomY = -0.5;
	vert3[botIndex] = [0.0, bottomY, 0.0];
	norm3[botIndex] = [0.0, -1.0, 0.0];
	let unitAngle = 2*Math.PI / slices3;
	let coneHeight = 2.0;
	let radius = 1.0;
	mod = Math.sqrt(1.0 + Math.pow(radius/coneHeight, 2));
	
	for(i = 0; i < slices3; i++) {
		//base circle vertices and normals
		vert3[i] = [Math.cos(unitAngle * i)*radius, -0.5, Math.sin(unitAngle*i)*radius];
		norm3[i] = [0.0, -1.0, 0.0];
		//base circle indexes
		ind3[3*i]   = botIndex;						//base point
		ind3[3*i+1] = i;							//itself	
		ind3[3*i+2] = (i < slices3-1) ? i+1 : 0;	//its next

		//side circle vertices and normals
		vert3[latIndex+i] = vert3[i];
		norm3[latIndex+i] = [Math.cos(unitAngle*i)/mod, (radius/coneHeight)/mod, Math.sin(unitAngle*i)/mod];

		//top points vertices (the same for all) and normals
		vert3[topIndex+i] = [0.0, bottomY+coneHeight, 0.0];
		norm3[topIndex+i] = [Math.cos(unitAngle*(i+0.5))/mod, (radius/coneHeight)/mod, Math.sin(unitAngle*(i+0.5))/mod];

		//side triangle 
		ind3[3*(latIndex+i)] = latIndex+i; 										//itself
		ind3[3*(latIndex+i)+1] = topIndex+i; 									//its top point
		ind3[3*(latIndex+i)+2] = i < (slices3-1) ? latIndex+i+1 : latIndex;		//its next
	}

	addMesh(vert3, norm3, ind3, color3);

	// Draws a Sphere
	var vert4 = [[0.0, 1.0, 0.0]];
	var norm4 = [[0.0, 1.0, 0.0]];
	var ind4 = [];
	var color4 = [0.0, 1.0, 1.0];
	var slices4 = 8;
	//even mode: an even number of horizontal circles will be created even with an odd number of slices.
	var evenMode = true;
	
	let j = 0;
	let halfSlices = slices4 % 2 == 0 ? (slices4/2)-1 : ((slices4-1)/2);
	let y = 0.0;
	//angle working as unit, given by slices4
	let alphaH = 2*Math.PI / slices4;
	let alphaV;
	let alphaShifter; //= 1/2 alphaH every 2 rows of points
	let indPointer = 0;
	if(evenMode) {
		alphaV = slices4 % 2 == 0 ? alphaH : 2*Math.PI/(slices4+1);
	} else {
		alphaV = alphaH;
	}
	
	//first round, connect first stratum to top point (vert4[0])
	i=0;
	y = Math.cos(alphaV); //y for current circle points
	for (j = 0; j < slices4; j++) {
		vert4[j+1] = [Math.cos(alphaH*j)*Math.sin(alphaV), y, Math.sin(alphaH*j)*Math.sin(alphaV)];
		norm4[j+1] = vert4[j+1];
		ind4[indPointer++] = 0;
		ind4[indPointer++] = j == slices4-1 ? 1 : j+2; //the next point, but if is the last point, add the first point of the circle
		ind4[indPointer++] = j+1; //the just added point
	}
	
	let evenRound;
	
	//for i to 2 up to half the number of slices (except the last strip), draw the middle strips
	for(i = 1; i < halfSlices; i++) {
		y = Math.cos(alphaV*(i+1)); //y for current circle points
		evenRound = i%2 == 0;
		alphaShifter = evenRound? 0 : alphaH/2;
		
		for (j = 0; j < slices4; j++) {
			vert4[slices4*i+j+1] = [Math.cos(alphaH*j+alphaShifter)*Math.sin(alphaV*(i+1)), 
									y, 
									Math.sin(alphaH*j+alphaShifter)*Math.sin(alphaV*(i+1))]; //add the new vertex
			norm4[slices4*i+j+1] = vert4[slices4*i+j+1];

			if(evenRound) {
				ind4[indPointer++] 		= i*slices4+j+1;	//itself
				ind4[indPointer++] 	= j > 0 ? (i-1)*slices4+j 	: i*slices4;	//its previous on the last cycle
				ind4[indPointer++] 	= (i-1)*slices4+j+1; //itself but on the previous circle.
				
				
				ind4[indPointer++] 	= i*slices4+j+1;	//itself;
				ind4[indPointer++] 	= j > 0 ? i*slices4+j : (i+1)*slices4; //its previous, cyclically
				ind4[indPointer++]	= j > 0 ? (i-1)*slices4+j 	: i*slices4;	//its previous on the last cycle
			} else {
				ind4[indPointer++] 		= i*slices4+j+1;	//itself
				ind4[indPointer++] 	= j < slices4-1 ? (i-1)*slices4+j+2	: (i-1)*slices4+1; //the next but on the previous circle, cyclically.
				ind4[indPointer++] 	= j < slices4-1 ? i*slices4+j+2 	: i*slices4+1;	//its next or the first of the circle if is the last
			
				ind4[indPointer++] 	= i*slices4+j+1;	//itself;
				ind4[indPointer++] 	= (i-1)*slices4+j+1; //its parallel on previous circle
				ind4[indPointer++]	= j < slices4-1 ? (i-1)*slices4+j+2	: (i-1)*slices4+1; //the next but on the previous circle, cyclically.
			}
			
		}
	}
	
	//last iteration: create the bottom point and connect it to the last strip
	y = evenMode ? -1.0 : Math.cos(alphaV*(halfSlices+1));
	vert4[slices4*halfSlices+1] = [0.0, y, 0.0];
	norm4[slices4*halfSlices+1] = [0.0, -1.0, 0.0];
	
	for(j=0; j < slices4; j++) {
		ind4[indPointer++] 		= slices4*halfSlices+1; 		//the bottom point;
		ind4[indPointer++] 	= slices4*halfSlices+1-slices4+j;	//current point
		ind4[indPointer++] 	= j < slices4-1 ? slices4*halfSlices+1-slices4+j+1 : slices4*halfSlices+1-slices4;	//the next point wrt the last, cyclically
	}
	addMesh(vert4, norm4, ind4, color4);
}

