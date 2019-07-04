//Parameters for Camera (10/13/36) - -20.-20
const PLAYER_SPEED = 0.1;
const PLAYER_HEIGHT = 0.4 // height of the player (camera y wrt to the ground)

const degToRad = Math.PI/180.0

var cx = 0.0;
var cy = PLAYER_HEIGHT
var cz = 0.0;
var elevation = 0.0;
var angle = 90.0;

var delta = 2.0;
var camSpeed = PLAYER_SPEED

function tp(x, y, z) {
	cx = x
	cy = y
	cz = z
}

//TODO restrictions on movements may go here; make smoother controls
function initInteraction(){
    var keyFunction =function(e) {
    	delta = 1
    	if (e.keyCode == 80) {	// p
            camSpeed += 0.1
            console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 79) {	// o, cam speed default for moving around
           camSpeed = 1.0
           console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 73) {	// i
            camSpeed -= 0.1
            console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 75) {	// k , player speed
            camSpeed = PLAYER_SPEED
            console.log("Cam Speed: " +camSpeed)
        }
        if(e.keyCode == 76) {	//l, log coordinates of camera
        	console.log("Cam position (X,Y,Z)(a,e): ("+cx+","+cy+","+cz+")("+angle+","+elevation+")")
        }
        if(e.keyCode == 74) {	//j, precision speed
        	camSpeed = 0.01
        	console.log("Cam Speed: " +camSpeed)
        }

        if (e.keyCode == 65) {	// a
            if(moveLight == 0) 	increasePosition(delta*camSpeed, -90);
            else lightPosition[0] -=delta;
        }
        if (e.keyCode == 68) {	// d
            if(moveLight == 0)	increasePosition(delta*camSpeed, 90);
            else lightPosition[0] +=delta;
        }
        if (e.keyCode == 87) {	// w
            if(moveLight == 0)  increasePosition(delta*camSpeed, 0);
            else lightPosition[2] -=delta;
        }
        if (e.keyCode == 83) {	// s
            if(moveLight == 0)  increasePosition(delta*camSpeed, 180);
            else lightPosition[2] +=delta;
        }
        if (e.keyCode == 82) {	// r
            if(moveLight == 0)  cy+=delta*camSpeed;
            else lightPosition[1] +=delta;
        }
        if (e.keyCode == 70) {	// f
            if(moveLight == 0)  cy-=delta*camSpeed;
            else lightPosition[1] -=delta;
        }

        if (e.keyCode == 37) {	// Left arrow
            if(moveLight == 0)angle-=delta * 10.0;
            else{
                lightDirection[0] -= 0.1 * Math.cos(utils.degToRad(angle));
                lightDirection[2] -= 0.1 * Math.sin(utils.degToRad(angle));
            }
        }
        if (e.keyCode == 39) {	// Right arrow
            if(moveLight == 0)angle+=delta * 10.0;
            else{
                lightDirection[0] += 0.1 * Math.cos(utils.degToRad(angle));
                lightDirection[2] += 0.1 * Math.sin(utils.degToRad(angle));
            }
        }
        if (e.keyCode == 38) {	// Up arrow
            if(moveLight == 0)elevation+=delta * 10.0;
            else{
                lightDirection[0] += 0.1 * Math.sin(utils.degToRad(angle));
                lightDirection[2] -= 0.1 * Math.cos(utils.degToRad(angle));
            }
        }
        if (e.keyCode == 40) {	// Down arrow
            if(moveLight == 0)elevation-=delta*10.0;
            else{
                lightDirection[0] -= 0.1 * Math.sin(utils.degToRad(angle));
                lightDirection[2] += 0.1 * Math.cos(utils.degToRad(angle));
            }
        }
        //console.log(" ("+cx + "/" + cy + "/" + cz + ") - "+ elevation + "." + angle);
    }

    //'window' is a JavaScript object (if "canvas", it will not work)
    window.addEventListener("keydown", keyFunction, false);
}


/**
*	increment the position of the camera according to the current angle which is facing, of the specified amount,
*	in the specified direction. direction is a number ranging from 0 to 360, clockwise
*/
function increasePosition(amount, direction) {
	let angleR = (angle + direction -90)*degToRad
	cx += Math.cos(angleR)*amount
	cz += Math.sin(angleR)*amount
}