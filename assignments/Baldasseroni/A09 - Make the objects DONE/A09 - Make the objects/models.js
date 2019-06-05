function buildGeometry() {
	var i;
	
	// Draws a pyramid
	var vert1 = [[-1.0,-1.0,0.0], [1.0,-1.0,0.0], [0.0,1.0,0.0], [0.0,0.0,4.0]];
	var ind1 = [0,1,3, 1,2,3, 2,0,3, 0,2,1]; 
	var color1 = [1.0, 0.0, 0.0];
	addMesh(vert1, ind1, color1);

	// Draws a cube
	var vert2 = [[-1.0,-1.0,0.0], [1.0,-1.0,0.0], [1.0,1.0,0.0], [-1.0,1.0,0.0], [-1.0,-1.0,2.0], [1.0,-1.0,2.0], [1.0,1.0,2.0], [-1.0,1.0,2.0]];
	var ind2 = [0,3,1, 3,2,1, 2,6,5, 2,5,1, 3,7,6, 3,6,2, 0,4,7, 0,7,3, 1,5,4, 1,4,0, 4,5,6, 4,6,7];
	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);

	// Draws a Monopoly house
	var vert3 = [[-1.0,-1.0,0.0], [1.0,-1.0,0.0], [1.0,1.0,0.0], [-1.0,1.0,0.0], [0.0,1.5,0.0], [-1.0,-1.0,-2.0], [1.0,-1.0,-2.0], [1.0,1.0,-2.0], [-1.0,1.0,-2.0], [0.0,1.5,-2.0]];
	var ind3 = [0,1,2,  0,2,3,  3,2,4, 0,5,6, 0,6,1, 7,8,9, 5,8,7, 5,7,6, 0,3,8, 0,8,5, 1,6,7, 1,7,2, 3,4,9, 3,9,8, 7,9,4, 7,4,2];
	var color3 = [0.0, 1.0, 0.0];
	addMesh(vert3, ind3, color3);
	
	// Draws a Cone
	var vert4 = [[0.0, 0.0, 0.0]];
	var ind4 = [];
	var color4 = [1.0, 1.0, 0.0];
	var slices4 = 20;
    vert4[slices4+1] = [0.0, 0.0, -2.0];
	for(i = 0; i < slices4; i++) {
		vert4[i+1] = [Math.cos(2*Math.PI / slices4 * i), Math.sin(2*Math.PI / slices4 * i), 0.0];
        //base
		ind4[3*i]   = 0;
		ind4[3*i+1] = i+1;
		ind4[3*i+2] = (i < slices4-1) ? i+2 : 1 ;
        //lati
        ind4[3*(slices4+i)]   = slices4+1;
		ind4[3*(slices4+i)+1] = (i < slices4-1) ? i+2 : 1 ;
		ind4[3*(slices4+i)+2] = i+1 ;
	}	
	addMesh(vert4, ind4, color4);

	// Draws a Cylinder
	var vert5 = [[0.0, 0.0, 0.0]];
	var ind5 = [];
	var color5 = [1.0, 0.0, 1.0];
	var slices5 = 64;
    var base2 = slices5 + 1;
    vert5[base2] = [0.0, 0.0, -2.0];
	for(i = 0; i < slices5; i++) {
        //base1
		vert5[i+1] = [Math.cos(2*Math.PI / slices5 * i), Math.sin(2*Math.PI / slices5 * i), 0.0];
		ind5[3*i]   = 0;
		ind5[3*i+1] = i+1;
		ind5[3*i+2] = (i < slices5-1) ? i+2 : 1 ;
        //base2
        vert5[i+1+base2] = [Math.cos(2*Math.PI / slices5 * i), Math.sin(2*Math.PI / slices5 * i), -2.0];
        ind5[3*(slices5+i)] = base2;
        ind5[3*(slices5+i)+1] = (i < slices5-1) ? base2+i+2 : base2+1 ;
        ind5[3*(slices5+i)+2] = base2+i+1 ;
        //lati
        ind5[3*(2*slices5+i)] = (i < slices5-1) ? i+2 : 1 ;
        ind5[3*(2*slices5+i)+1] = i+1;
        ind5[3*(2*slices5+i)+2] = (i < slices5-1) ? base2+i+2 : base2+1 ;
        
        ind5[3*(3*slices5+i)+3] = i+1;
        ind5[3*(3*slices5+i)+4] = base2 + i + 1;
        ind5[3*(3*slices5+i)+5] = (i < slices5-1) ? base2+i+2 : base2+1 ;
	}	
	addMesh(vert5, ind5, color5);

	// Draws a Sphere
	var vert6 = [[0.0, 0.0, 0.0]];
	var ind6 = [];
	var color6 = [0.0, 1.0, 1.0];
	var slices6 = 64;
    vert6[slices6*4 + 1] = [0.0, 0.0, -3.5];
	for(i = 0; i < slices6; i++) {
        //upper half
		vert6[i+1] = [Math.sin(2*Math.PI / slices6 * i), -Math.cos(2*Math.PI / slices6 * i), -0.25];
		vert6[i+slices6+1] = [1.8*Math.sin(2*Math.PI / slices6 * (i+0.5)), -1.8*Math.cos(2*Math.PI / slices6 * (i+0.5)), -1.25];
		ind6[3*i]   = 0 ;
		ind6[3*i+1] = i + 1 ;
		ind6[3*i+2] = (i < slices6-1) ? i+2 : 1 ;
        
		ind6[3*(slices6+i)] = i + 1;
        ind6[3*(slices6+i)+1] = slices6 + i + 1 ;
		ind6[3*(slices6+i)+2] = (i < slices6-1) ? i+2 : 1 ;
        
        ind6[3*(2*slices6+i)] = (i < slices6-1) ? slices6+i+2 : slices6+1 ;
        ind6[3*(2*slices6+i)+1] = (i < slices6-1) ? i+2 : 1 ;
        ind6[3*(2*slices6+i)+2] = slices6 + i + 1 ;
        
        //middle band
        vert6[i+(slices6*2)+1] = [1.8*Math.sin(2*Math.PI / slices6 * (i+0.5)), -1.8*Math.cos(2*Math.PI / slices6 * (i+0.5)), -2.25];
        ind6[3*(3*slices6+i)] = slices6 + i + 1 ;
        ind6[3*(3*slices6+i)+1] = (i < slices6-1) ? 2*slices6+i+2 : 2*slices6+1 ;
        ind6[3*(3*slices6+i)+2] = (i < slices6-1) ? slices6+i+2 : slices6+1 ;
        
        ind6[3*(4*slices6+i)] = (i < slices6-1) ? 2*slices6+i+2 : 2*slices6+1 ;
        ind6[3*(4*slices6+i)+1] = slices6 + i + 1 ;
        ind6[3*(4*slices6+i)+2] = 2*slices6 + i + 1 ;
        
        //lower half
        vert6[i+(slices6*3)+1] = [Math.sin(2*Math.PI / slices6 * i), -Math.cos(2*Math.PI / slices6 * i), -3.25];
        ind6[3*(5*slices6+i)] = 2*slices6+i+1 ;
        ind6[3*(5*slices6+i)+1] = 3*slices6+i+1 ;
        ind6[3*(5*slices6+i)+2] = (i < slices6-1) ? 3*slices6+i+2 : 3*slices6+1 ;
        
        ind6[3*(6*slices6+i)] = (i < slices6-1) ? 3*slices6+i+2 : 3*slices6+1 ;
        ind6[3*(6*slices6+i)+1] = (i < slices6-1) ? 2*slices6+i+2 : 2*slices6+1 ;
        ind6[3*(6*slices6+i)+2] = 2*slices6 + i + 1 ;
            
        ind6[3*(7*slices6+i)] = 4*slices6 + 1 ;
        ind6[3*(7*slices6+i)+1] = (i < slices6-1) ? 3*slices6+i+2 : 3*slices6+1 ;
        ind6[3*(7*slices6+i)+2] = 3*slices6+i+1 ;
	}
	addMesh(vert6, ind6, color6);
}

