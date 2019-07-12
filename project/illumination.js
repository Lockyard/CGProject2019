//Constants for finding specific objects
const OBJ_IS_COPP_KEY = 0;
const OBJ_IS_GOLD_KEY = 1;
const OBJ_IS_GOLD_KEYHOLE = 3;
const OBJ_IS_COPP_KEYHOLE = 4;
const OBJ_IS_LEVER_1 = 5;
const OBJ_IS_LEVER_3 = 6;
const OBJ_IS_LEVER_5 = 7;

//type of light, the user can switch among these values
const LIGHT_TYPE_MIN = 0
const LIGHT_TYPE_MAX = 2

const CONE_OUT_MAX = 70
const CONE_OUT_MIN = 5
const CONE_IN_MAX = 1.0
const CONE_IN_MIN = 0.0

var lightConeIn = 0.7;
var lightConeOut = 30.0;
var lightDecay = 1.0
var lightTarget = 1.0

var currentLightType = 1


var reachableLever = [false, false, false];
var reachableKey = [false, false];
var reachableKeyHole = [false, false];
var carryingKey = [false, false];

var flag = 0;
var colorInfluence = 0.0;
var delta = 1.0;

/**
 *  This function will check if the conditions for illuminating a reachable object are met
 *  and act on consequence
 *  @param {index of the mesh we are considering} i
 */
function illuminateReachableObjects(i){
    if( (i == OBJ_IS_LEVER_1  && reachableLever[0] )
        || (i == OBJ_IS_LEVER_3  && reachableLever[1])
        || (i == OBJ_IS_LEVER_5  && reachableLever[2])
        || (i == OBJ_IS_COPP_KEY && reachableKey[0] && !carryingKey[0])
        || (i == OBJ_IS_GOLD_KEY && reachableKey[1] && !carryingKey[1])
        || (i == OBJ_IS_COPP_KEYHOLE && reachableKeyHole[1] && carryingKey[0])
        || (i == OBJ_IS_GOLD_KEYHOLE && reachableKeyHole[0] && carryingKey[1])
    ) {
        gl.uniform1f(lightUpObjectHandle, 1.0);
        gl.uniform1f(lightUpPercentageHandle, animateObjectLight());
    }else {
        gl.uniform1f(lightUpObjectHandle, 0.0);
        gl.uniform1f(lightUpPercentageHandle, 0.0);
    }

}

function animateObjectLight(){
    if (flag == 0)
        colorInfluence += delta/5;
    else
        colorInfluence -= delta/5;
    if (colorInfluence <= 0.001)
        flag = 0;
    else if (colorInfluence >= 0.100)
        flag = 1;
    return colorInfluence;
}


/**
 * Change the character's light to the next type, in order, from the one available. If reach the max light type, go back to the min one
 */
function changeToNextLight() {
    if(++currentLightType > LIGHT_TYPE_MAX) {
        currentLightType = LIGHT_TYPE_MIN
    }
} 