//Parameters for Camera (10/13/36) - -20.-20
const PLAYER_SPEED = 0.01
const PLAYER_ANGLE_SENSITIVITY = 0.07
const PLAYER_HEIGHT = 0.4 // height of the player (camera y wrt to the ground)

const degToRad = Math.PI/180.0

var cx = 0.0;
var cy = PLAYER_HEIGHT
var cz = 0.0;
var elevation = 0.0;
var angle = 90.0;

var delta = 2.0;
var camSpeed = PLAYER_SPEED
var camAngSpeed = PLAYER_ANGLE_SENSITIVITY


//variables for input control.
//movements, wasd
var a_pressed = false;
var s_pressed = false;
var d_pressed = false;
var w_pressed = false;
var r_pressed = false;
var f_pressed = false;

//arrows, l r d u
var ra_pressed = false;
var la_pressed = false;
var da_pressed = false;
var ua_pressed = false;



//TODO restrictions on movements may go here; make smoother controls
function initInteraction(){
    var keyDownFunction = function(e) {

        if (e.keyCode == 65) {	// a
            a_pressed = true;
        }
        if (e.keyCode == 68) {	// d
            d_pressed= true;
        }
        if (e.keyCode == 87) {	// w
            w_pressed = true;
        }
        if (e.keyCode == 83) {	// s
            s_pressed = true;
        }
        if (e.keyCode == 82) {	// r
            r_pressed = true;
        }
        if (e.keyCode == 70) {	// f
            f_pressed = true;
        }

        if (e.keyCode == 37) {	// Left arrow
            la_pressed = true;
        }
        if (e.keyCode == 39) {	// Right arrow
            ra_pressed = true;
        }
        if (e.keyCode == 38) {	// Up arrow
            ua_pressed = true;
        }
        if (e.keyCode == 40) {	// Down arrow
            da_pressed = true;
        }

        if (e.keyCode == 80) {  // p
            camSpeed += 0.1
            console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 79) {  // o, cam speed default for moving around
           camSpeed = 1.0
           console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 73) {  // i
            camSpeed -= 0.1
            console.log("Cam Speed: " +camSpeed)
        }
        if (e.keyCode == 75) {  // k , player speed
            camSpeed = PLAYER_SPEED
            console.log("Cam Speed: " +camSpeed)
        }
        if(e.keyCode == 76) {   //l, log coordinates of camera
            console.log("Cam position (X,Y,Z)(a,e): ("+cx+","+cy+","+cz+")("+angle+","+elevation+")")
        }
        if(e.keyCode == 74) {   //j, precision speed
            camSpeed = 0.01
            console.log("Cam Speed: " +camSpeed)
        }
        //console.log(" ("+cx + "/" + cy + "/" + cz + ") - "+ elevation + "." + angle);
    }

    //when key goes up, button status is no more pressed
    var keyUpFunction = function(e) {
        if (e.keyCode == 65) {  // a
            a_pressed = false;
        }
        if (e.keyCode == 68) {  // d
            d_pressed= false;
        }
        if (e.keyCode == 87) {  // w
            w_pressed = false;
        }
        if (e.keyCode == 83) {  // s
            s_pressed = false;
        }
        if (e.keyCode == 82) {  // r
            r_pressed = false;
        }
        if (e.keyCode == 70) {  // f
            f_pressed = false;
        }

        if (e.keyCode == 37) {  // Left arrow
            la_pressed = false;
        }
        if (e.keyCode == 39) {  // Right arrow
            ra_pressed = false;
        }
        if (e.keyCode == 38) {  // Up arrow
            ua_pressed = false;
        }
        if (e.keyCode == 40) {  // Down arrow
            da_pressed = false;
        }
    }

    //'window' is a JavaScript object (if "canvas", it will not work)
    window.addEventListener("keyup", keyUpFunction, false);
    window.addEventListener("keydown", keyDownFunction, false);
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

function updateInput() {
    if (a_pressed) {  // a
        increasePosition(delta*camSpeed, -90);
    }
    if (d_pressed) {  // d
        increasePosition(delta*camSpeed, 90);
    }
    if (w_pressed) {  // w
        increasePosition(delta*camSpeed, 0);
    }
    if (s_pressed) {  // s
        increasePosition(delta*camSpeed, 180);
    }
    if (r_pressed) {  // r
        cy+=delta*camSpeed;
    }
    if (f_pressed) {  // f
        cy-=delta*camSpeed;
    }

    if (la_pressed) {  // Left arrow
        angle-=delta * 10.0 * camAngSpeed;
    }
    if (ra_pressed) {  // Right arrow
        angle+=delta * 10.0 * camAngSpeed;
    }
    if (ua_pressed) {  // Up arrow
        elevation+=delta * 10.0 * camAngSpeed;
    }
    if (da_pressed) {  // Down arrow
        elevation-=delta*10.0 * camAngSpeed;
    }
}

//FUNCTIONS USED FOR CHEATS (and debug)//////////////////////////////////////

//teleport the player (the camera) to the position indicated
function tp(x, y, z) {
    cx = x
    cy = y
    cz = z
}

function setCamSpeed(speed) {
    camSpeed = speed
}