function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2
	
	//borders
	line(-0.5, -0.7, -0.5, 0.5);
	line(-0.5, 0.5, 0, 0.8);
	line(0, 0.8, 0.5, 0.5);
	line(0.5, 0.5, 0.5, -0.7);
	line(0.5, -0.7, -0.5, -0.7);
	
	//chimney
	//y0 = 0.8, yN = 0.5, N = 5: dy = (0.5 - 0.8)/ 5
	var y0 = 0.8;
	var yN = 0.5;
	var N = 5;
	var dy = (yN - y0)/N;
	line(0.2, y0 + dy*2, 0.2, 0.9);
	line(0.2, 0.9, 0.4, 0.9);
	line(0.4, 0.9, 0.4, y0 +dy*4);
	
	//door
	line(-0.1, -0.7, -0.1, -0.3);
	line(-0.1, -0.3, 0.1, -0.3);
	line(0.1, -0.3, 0.1, -0.7);
}

