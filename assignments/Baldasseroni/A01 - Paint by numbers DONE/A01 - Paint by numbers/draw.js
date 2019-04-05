function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2
	line( 0.0, 0.8, 0.5, 0.5);
	line( 0.0, 0.8,-0.5, 0.5);
	line( 0.5,-0.7,-0.5,-0.7);
    line( 0.5, 0.5, 0.5,-0.7);
    line(-0.5, 0.5,-0.5,-0.7);
    //Door
    line(-0.1,-0.7,-0.1,-0.3);
    line( 0.1,-0.7, 0.1,-0.3);
    line(-0.1,-0.3, 0.1,-0.3);
    //Window left
    line(-0.3, 0.3,-0.1, 0.3);
    line(-0.1, 0.3,-0.1, 0.1);
    line(-0.1, 0.1,-0.3, 0.1);
    line(-0.3, 0.1,-0.3, 0.3);
    //Window right
    line( 0.3, 0.3, 0.1, 0.3);
    line( 0.1, 0.3, 0.1, 0.1);
    line( 0.1, 0.1, 0.3, 0.1);
    line( 0.3, 0.1, 0.3, 0.3);
    //Chimney
    var x1 = 0;
    var y1 = 0.8;
    var x2 = 0.5;
    var y2 = 0.5;
    var x_chimney1 = 0.2;
    var x_chimney2 = 0.3;
    var y_chimney1 = y1 + ((x_chimney1 - x1)*(y2-y1))/(x2-x1);
    var y_chimney2 = y1 + ((x_chimney2 - x1)*(y2-y1))/(x2-x1);
    line(x_chimney1, y_chimney1, x_chimney1, 0.8);
    line(x_chimney1, 0.8, x_chimney2, 0.8);
    line(x_chimney2, 0.8, x_chimney2, y_chimney2);
}

