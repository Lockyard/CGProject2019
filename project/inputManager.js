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
//increment for the spotlight's cone
var coneOutIncrement = 0, coneInIncrement = 0

const CONE_IN_INC_SPEED = 1.0
const CONE_OUT_INC_SPEED = 100.0

const COLOR_CHANGE_SPEED = 1.0




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

//others
var shift_pressed = false;

//for light parameters control
//p and o: change target distance for light
var p_pressed = false
var o_pressed = false
//l and k: change cone in and out of spotlight (this shouldn't be needed but mousewheel events sometime fails)
var l_pressed = false
var k_pressed = false

//num 1, 2 and 3, to decrement r g b values
var n1_pressed = false
var n2_pressed = false
var n3_pressed = false
//num 8, 9 and 0, to increment r g b values
var n8_pressed = false
var n9_pressed = false
var n0_pressed = false


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
            shift_pressed = true
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
        if (e.keyCode == 32) {	// Space bar, change light type. if shift is pressed, change to white light
            if(shift_pressed) {
                setLightColor(1.0, 1.0, 1.0)
            } else {
                changeToNextLight()
            }
        }
        //change light target value 
        if (e.keyCode == 80) {  // p
            p_pressed = true
        }
        if (e.keyCode == 79) {  // o
            o_pressed = true
        }
        //change light cone in and out value
        if (e.keyCode == 76) {  // l
            l_pressed = true
        }
        if (e.keyCode == 75) {  // k
            k_pressed = true
        }

        //change light colors
        //decrease
        if (e.keyCode == 49) {  // 1
            n1_pressed = true
        }
        if (e.keyCode == 50) {  // 2
            n2_pressed = true
        }
        if (e.keyCode == 51) {  // 3
            n3_pressed = true
        }
        //increase
        if (e.keyCode == 56) {  // 8
            n8_pressed = true
        }
        if (e.keyCode == 57) {  // 9
            n9_pressed = true
        }
        if (e.keyCode == 48) {  // 0
            n0_pressed = true
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
            shift_pressed = false
        }

        //inspect
        if (e.keyCode == 69) {  // e
            e_pressed = false;
        }

        //change light target value 
        if (e.keyCode == 80) {  // p
            p_pressed = false
        }
        if (e.keyCode == 79) {  // o
            o_pressed = false
        }

        //change light cone in and out value
        if (e.keyCode == 76) {  // l
            l_pressed = false
        }
        if (e.keyCode == 75) {  // k
            k_pressed = false
        }

        //change light colors
        //decrease
        if (e.keyCode == 49) {  // 1
            n1_pressed = false
        }
        if (e.keyCode == 50) {  // 2
            n2_pressed = false
        }
        if (e.keyCode == 51) {  // 3
            n3_pressed = false
        }
        //increase
        if (e.keyCode == 56) {  // 8
            n8_pressed = false
        }
        if (e.keyCode == 57) {  // 9
            n9_pressed = false
        }
        if (e.keyCode == 48) {  // 0
            n0_pressed = false
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

function updateInput(delta) {

    updatePlayerVisual()

    updateControlledLightParams(delta)

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
 * Update parameters for the light controlled by the player
 */
function updateControlledLightParams(delta) {
    //o and p, for change light target
    if(o_pressed)
        lightTarget = utils.clamp(lightTarget - 0.25, LIGHT_TARGET_MIN, LIGHT_TARGET_MAX)
    else if (p_pressed)
        lightTarget = utils.clamp(lightTarget + 0.25, LIGHT_TARGET_MIN, LIGHT_TARGET_MAX)

    //update light color channels
    //1, 2, 3: decrease r g b
    if(n1_pressed) {
        lightColor[0] = utils.clamp(lightColor[0]-delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    if(n2_pressed) {
        lightColor[1] = utils.clamp(lightColor[1]-delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    if(n3_pressed) {
        lightColor[2] = utils.clamp(lightColor[2]-delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    //8, 9, 0: increase r g b
    if(n8_pressed) {
        lightColor[0] = utils.clamp(lightColor[0]+delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    if(n9_pressed) {
        lightColor[1] = utils.clamp(lightColor[1]+delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    if(n0_pressed) {
        lightColor[2] = utils.clamp(lightColor[2]+delta*COLOR_CHANGE_SPEED, 0.0, 1.0)
    }
    
    //change light cone in and out value
    if (l_pressed) {  // l
        if(shift_pressed) {
            lightConeIn  = utils.clamp(lightConeIn + delta*CONE_IN_INC_SPEED, CONE_IN_MIN, CONE_IN_MAX)
        } else {
            lightConeOut = utils.clamp(lightConeOut + delta*CONE_OUT_INC_SPEED, CONE_OUT_MIN, CONE_OUT_MAX)
        }
    } else  if (k_pressed) {  // k
        if(shift_pressed) {
            lightConeIn  = utils.clamp(lightConeIn - delta*CONE_IN_INC_SPEED, CONE_IN_MIN, CONE_IN_MAX)
        } else {
            lightConeOut = utils.clamp(lightConeOut - delta*CONE_OUT_INC_SPEED, CONE_OUT_MIN, CONE_OUT_MAX)
        }
    }
    //if nor l or k are pressed increment cones according to mousewheel event
    else {
        lightConeOut = utils.clamp(lightConeOut + coneOutIncrement, CONE_OUT_MIN, CONE_OUT_MAX)
        lightConeIn  = utils.clamp(lightConeIn + coneInIncrement, CONE_IN_MIN, CONE_IN_MAX)
    }
    coneInIncrement = 0
    coneOutIncrement = 0
}


/**
 * increment the increments used at each cycle for the cone in and out
 * @param {*} deltaCone 
 */
function incrementConeOut(deltaCone) {
    if(shift_pressed)
        coneInIncrement += deltaCone*0.001
    else 
        coneOutIncrement += deltaCone*0.1
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

    p_pressed = false
    o_pressed = false

    l_pressed = false
    k_pressed = false

    n1_pressed = false
    n2_pressed = false
    n3_pressed = false

    n8_pressed = false
    n9_pressed = false
    n0_pressed = false

    shift_pressed = false;

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