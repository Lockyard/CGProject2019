/** 
 * Input manager. Contains methods for managing the player and its input
 * 
 */

//debug vars
var cheatsEnabled = false;

//constants for game values. If something is to change it's enough to change it here
const PLAYER_SPEED = 1.0
const PLAYER_RUNNING_SPEED = 2.4
const PLAYER_ANGLE_H_SENSITIVITY = 8.0
const PLAYER_ANGLE_V_SENSITIVITY = 8.0
const PLAYER_ANGLE_SENSITIVITY = 10.0
const MAX_ANGLE_V = 85.0
const MIN_ANGLE_V = -85.0
const PLAYER_HEIGHT = 0.4   // height of the player (camera y wrt to the ground)
const degToRad = Math.PI/180.0

//  camera/character coordinates
var cx = 0.0;
var cy = PLAYER_HEIGHT
var cz = 0.0;
var elevation = 0.0;
var angle = 90.0;

var delta = 1.0;
var camSpeed = PLAYER_SPEED
var camAngSpeed = PLAYER_ANGLE_SENSITIVITY

//increments for the angle of the camera used when input must be updated
var angleIncrementH = 0, angleIncrementV = 0




//variables for input control.
//movements, wasd
var a_pressed = false;
var s_pressed = false;
var d_pressed = false;
var w_pressed = false;

//actions of player
var e_pressed = false

//for cheats and debug, used to fly
var r_pressed = false;
var f_pressed = false;


//arrows, l r d u
var ra_pressed = false;
var la_pressed = false;
var da_pressed = false;
var ua_pressed = false;




function initInteraction(){
    var keyDownFunction = function(e) {

        //wasd
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
        //shift
        if (e.keyCode == 16) { //if shift down, cam speed is the one when player is running
            camSpeed = PLAYER_RUNNING_SPEED
        }

        //actions, to do only when user presses the button but not if he holds it (so a check must be done)
        if (e.keyCode == 69 && e_pressed != true) { // e
            e_pressed = true
            playerActionInspect(cx, cy, cz, angle, elevation)
        }

        //flight for debug/cheat
        if (e.keyCode == 82) {	// r
            r_pressed = true;
        }
        if (e.keyCode == 70) {	// f
            f_pressed = true;
        }

        //camera controls with arrows
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

        //light controls
        if (e.keyCode == 32) {	// Space bar
            changeToNextLight()
        }


        //controls for camSpeed
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
        
    }

    //when key goes up, button status is no more pressed
    var keyUpFunction = function(e) {
        //wasd
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
        //shift
        if (e.keyCode == 16) { //if shift up, cam speed becomes the standard speed
            camSpeed = PLAYER_SPEED
        }

        if (e.keyCode == 69) {  // e
            e_pressed = false;
        }


        //flight, debug/cheat
        if (e.keyCode == 82) {  // r
            r_pressed = false;
        }
        if (e.keyCode == 70) {  // f
            f_pressed = false;
        }

        //camera controls with arrows
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

        //b, for enabling cheats
        if (e.keyCode == 66) {  
            cheatsEnabled = !cheatsEnabled
            console.log("cheats enabled:"+cheatsEnabled)
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
    if(cheatsEnabled) {
        cx += Math.cos(angleR)*amount
        cz += Math.sin(angleR)*amount
    } else {
        cx = moveOnX(cx, cz, Math.cos(angleR)*amount)
	    cz = moveOnZ(cx, cz, Math.sin(angleR)*amount)
    }
	
}

function updateInput() {
    delta = updateDelta()

    updatePlayerVisual()

    //wasd
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

    //flight, if cheats enabled
    if (r_pressed && cheatsEnabled) {  // r
        cy+=delta*camSpeed;
    }
    if (f_pressed && cheatsEnabled) {  // f
        cy-=delta*camSpeed;
    }

    //camera controls with arrows
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

    document.getElementById('debugCamInfo').innerText = "cx:"+cx.toFixed(3)+", cy:"+cy.toFixed(3)+", cz:"+cz.toFixed(3)+", angle:" + angle.toFixed(3) + ", ele:" + elevation.toFixed(3)

    updateMap(delta, cx, cy, cz, angle, elevation)
}


/**
 * Update player's camera orientation (aka its visual)
 */
function updatePlayerVisual() {
    if(cheatsEnabled) {
        angle = (angle + angleIncrementH*delta*PLAYER_ANGLE_H_SENSITIVITY) % 360
        elevation = elevation - angleIncrementV*delta*PLAYER_ANGLE_V_SENSITIVITY
    } 
    else {
        //update values of angle and elevation of the total increment accumulated by mouse events since last frame (namely angleIncrementH and V)
        //angle must be bound from -360 to 360 (actually works either without this, but it's cleaner)
        angle = (angle + angleIncrementH*delta*PLAYER_ANGLE_H_SENSITIVITY) % 360
        //elevation must be bound between a max and min elevation to avoid strange character behaviors. Also its increment must be subtracted because 
        //Y in canvas is positive down
        elevation = Math.min(   Math.max(elevation - angleIncrementV*delta*PLAYER_ANGLE_V_SENSITIVITY,  MIN_ANGLE_V), MAX_ANGLE_V)
    }
    
    //reset increments
    angleIncrementH = 0
    angleIncrementV = 0

}

/**
 * Increment the visual values of the player in the specified directions
 * @param {Horizontal angle} angleH 
 * @param {Vertical angle (elevation)} angleV 
 */
function incrementPlayerVisual(angleH, angleV) {
    angleIncrementH += angleH
    angleIncrementV += angleV
}


/**
 * turn off all inputs
 */
function turnOffInputs() {
    a_pressed = false;
    s_pressed = false;
    d_pressed = false;
    w_pressed = false;

    e_pressed = false;

    r_pressed = false;
    f_pressed = false;

    ra_pressed = false;
    la_pressed = false;
    da_pressed = false;
    ua_pressed = false;

    camSpeed = PLAYER_SPEED
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