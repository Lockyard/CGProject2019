function buildGeometry() {
	var i;
	
	// Draws a pyramid
	/*	0	1
	*	3	2   (4 is top vertex)
	*/
	var vert1 = [[-1.0,-1.0, -1.0], [1.0,-1.0, -1.0], [1.0, -1.0, 1.0], [-1.0, -1.0, 1.0], [0.0,1.0,0.0]];
	var ind1 = [0,1,2,	2,3,0,	3,2,4,	0,3,4,	1,0,4,	2,1,4];
	var color1 = [1.0, 0.0, 0.0];
	addMesh(vert1, ind1, color1);

	// Draws a cube
	//first 4 verts = front vertexes, then back vertexes
	/*
	*		  _-7-----_-6
	*		3-------2-	|
	*		|		|	|
	*		|  (4)	| _-5
	*		0-------1-
	*/
	var vert2 = [[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0], [-1.0,-1.0,-1.0], [1.0,-1.0,-1.0], [1.0,1.0,-1.0], [-1.0,1.0,-1.0]];
	var ind2 = [0,1,2,	0,2,3,	1,5,6,	1,6,2,	5,4,7,	5,7,6,	4,0,3,	4,3,7,	4,5,1,	4,1,0,	3,2,6,	3,6,7];
	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);

	// Draws a Monopoly house
	/*
	*			 _.-9-_
	*		  _-4-_	  _-7  (8 behind 4)
	*		3-------2-	|
	*		|		|	|
	*		|  (5)	| _-6
	*		0-------1-
	*/
	var vert3 = [	[-1.0,-1.0, 1.5], [1.0,-1.0, 1.5], [1.0,1.0, 1.5], [-1.0,1.0, 1.5], [0.0,1.5, 1.5], 	//front 5
					[-1.0,-1.0,-1.5], [1.0,-1.0,-1.5], [1.0,1.0,-1.5], [-1.0,1.0,-1.5], [0.0,1.5,-1.5],]; 	//back 5
	var ind3 = [0,1,2,	0,2,3,	3,2,4,							//front
				1,6,7,	1,7,2,	5,6,1,	5,1,0,	8,5,0,	8,0,3, 	//right, bottom, left sides	
				8,3,4,	8,4,9,	7,4,2,	7,9,4,					//roof sides
				7,6,5,	7,5,8,	7,8,9];							//back
	var color3 = [0.0, 1.0, 0.0];
	addMesh(vert3, ind3, color3);
	
	// Draws a Cone
	var vert4 = [[0.0, 0.0, 0.0], [0.0, 0.0, -2.0]];
	var ind4 = [];
	var color4 = [1.0, 1.0, 0.0];
	var slices4 = 20;
	for(i = 0; i < slices4; i++) {
		vert4[i+2] = [Math.cos(2*Math.PI / slices4 * i), Math.sin(2*Math.PI / slices4 * i), 0.0];
		//base triangle 
		ind4[6*i]   = 0;
		ind4[6*i+1] = i+2;
		ind4[6*i+2] = (i < slices4-1) ? i+3 : 2 ;
		//side triangle
		ind4[6*i+3] = 1;
		ind4[6*i+4] = (i < slices4-1) ? i+3 : 2 
		ind4[6*i+5] = i+2;
	}
	
	
	addMesh(vert4, ind4, color4);

	// Draws a Cylinder
	var vert5 = [[0.0, 0.0, 1.5]];
	var slices5 = 10;
	var backCenter = slices5+1;
	var sidesOffset = backCenter*2;
	vert5[backCenter] = [0.0, 0.0, -1.5];
	
	var ind5 = [];
	var color5 = [1.0, 0.0, 1.0];
	
	for(i = 0; i < slices5; i++) {
		//front circle
		vert5[i+1] = [Math.cos(2*Math.PI / slices5 * i), Math.sin(2*Math.PI / slices5 * i), 1.5];
		ind5[3*i]   = 0;
		ind5[3*i+1] = i+1;
		ind5[3*i+2] = (i < slices5-1) ? i+2 : 1 ;
		
		//back circle, based on front circle
		vert5[backCenter+i+1] = [vert5[i+1][0], vert5[i+1][1], -1.5];
		ind5[3*(backCenter+i)]   = backCenter;
		ind5[3*(backCenter+i)+1] = backCenter + ((i < slices5-1) ? i+2 : 1);
		ind5[3*(backCenter+i)+2] = backCenter + i+1;
		
		//sides
		//first triangle
		ind5[3*(sidesOffset+i*2)] 	=	i + 1;
		ind5[3*(sidesOffset+i*2)+1] =	i + 1 + backCenter;
		ind5[3*(sidesOffset+i*2)+2] =	(i < slices5-1) ? i+2 : 1;
		//second triangle
		ind5[3*(sidesOffset+i*2)+3] =	(i < slices5-1) ? i+2 : 1;
		ind5[3*(sidesOffset+i*2)+4] =	i + 1 + backCenter;
		ind5[3*(sidesOffset+i*2)+5] =	(i < slices5-1) ? (i + backCenter + 2) : (backCenter + 1);
	}
	
	for(i = 0; i < slices5; i++) {
		
	}
	addMesh(vert5, ind5, color5);

	// Draws a Sphere.
	//draw 1 "circle" at time, at y given by the number of slices to do
	//note: the for cicle is splitted in 3 parts: the first and last iteration are done separately because even if the final result
	//would have been the same, N points (slices6) would have been in the sape point, on top and bottom. To reduce that, a special iteration
	//which connects the first and final strips to a single point is done.
	
	//even mode: an even number of horizontal circles will be created even with an odd number of slices.
	var evenMode = true;
	
	var j = 0;
	var vert6 = [[0.0, 1.0, 0.0]];
	var ind6 = [];
	var color6 = [0.0, 1.0, 1.0];
	const slices6 = 41;
	var halfSlices = slices6 % 2 == 0 ? (slices6/2)-1 : ((slices6-1)/2);
	var y = 0.0;
	//angle working as unit, given by slices6
	var alphaH = 2*Math.PI / slices6;
	var alphaV;
	var alphaShifter; //= 1/2 alphaH every 2 rows of points
	var indPointer = 0;
	if(evenMode) {
		alphaV = slices6 % 2 == 0 ? alphaH : 2*Math.PI/(slices6+1);
	} else {
		alphaV = alphaH;
	}
	
	//first round, connect first stratum to top point (vert6[0])
	i=0;
	y = Math.cos(alphaV); //y for current circle points
	for (j = 0; j < slices6; j++) {
		vert6[j+1] = [Math.cos(alphaH*j)*Math.sin(alphaV), y, Math.sin(alphaH*j)*Math.sin(alphaV)];
		ind6[indPointer++] = 0;
		ind6[indPointer++] = j == slices6-1 ? 1 : j+2; //the next point, but if is the last point, add the first point of the circle
		ind6[indPointer++] = j+1; //the just added point
	}
	
	var evenRound;
	
	//for i to 2 up to half the number of slices (except the last strip), draw the middle strips
	for(i = 1; i < halfSlices; i++) {
		y = Math.cos(alphaV*(i+1)); //y for current circle points
		evenRound = i%2 == 0;
		alphaShifter = evenRound? 0 : alphaH/2;
		
		for (j = 0; j < slices6; j++) {
			vert6[slices6*i+j+1] = [Math.cos(alphaH*j+alphaShifter)*Math.sin(alphaV*(i+1)), 
									y, 
									Math.sin(alphaH*j+alphaShifter)*Math.sin(alphaV*(i+1))]; //add the new vertex
			
			
			if(evenRound) {
				ind6[indPointer++] 		= i*slices6+j+1;	//itself
				ind6[indPointer++] 	= j > 0 ? (i-1)*slices6+j 	: i*slices6;	//its previous on the last cycle
				ind6[indPointer++] 	= (i-1)*slices6+j+1; //itself but on the previous circle.
				
				
				ind6[indPointer++] 	= i*slices6+j+1;	//itself;
				ind6[indPointer++] 	= j > 0 ? i*slices6+j : (i+1)*slices6; //its previous, cyclically
				ind6[indPointer++]	= j > 0 ? (i-1)*slices6+j 	: i*slices6;	//its previous on the last cycle
			} else {
				ind6[indPointer++] 		= i*slices6+j+1;	//itself
				ind6[indPointer++] 	= j < slices6-1 ? (i-1)*slices6+j+2	: (i-1)*slices6+1; //the next but on the previous circle, cyclically.
				ind6[indPointer++] 	= j < slices6-1 ? i*slices6+j+2 	: i*slices6+1;	//its next or the first of the circle if is the last
			
				ind6[indPointer++] 	= i*slices6+j+1;	//itself;
				ind6[indPointer++] 	= (i-1)*slices6+j+1; //its parallel on previous circle
				ind6[indPointer++]	= j < slices6-1 ? (i-1)*slices6+j+2	: (i-1)*slices6+1; //the next but on the previous circle, cyclically.
			}
			
		}
	}
	
	//last iteration: create the bottom point and connect it to the last strip
	y = evenMode ? -1 : Math.cos(alphaV*(halfSlices+1));
	vert6[slices6*halfSlices+1] = [0.0, y, 0.0];
	
	for(j=0; j < slices6; j++) {
		ind6[indPointer++] 		= slices6*halfSlices+1; 		//the bottom point;
		ind6[indPointer++] 	= slices6*halfSlices+1-slices6+j;	//current point
		ind6[indPointer++] 	= j < slices6-1 ? slices6*halfSlices+1-slices6+j+1 : slices6*halfSlices+1-slices6;	//the next point wrt the last, cyclically
	}
	addMesh(vert6, ind6, color6);
}

