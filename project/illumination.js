//Constants for finding specific objects (are vars because must be initialized but are in fact constants)
var OBJ_IS_COPP_KEY
var OBJ_IS_GOLD_KEY
var OBJ_IS_GOLD_KEYHOLE
var OBJ_IS_COPP_KEYHOLE
var OBJ_IS_LEVER_1
var OBJ_IS_LEVER_3
var OBJ_IS_LEVER_5

//type of light, the user can switch among these values
const LIGHT_TYPE_MIN = 0
const LIGHT_TYPE_MAX = 2

const CONE_OUT_MAX = 70
const CONE_OUT_MIN = 5
const CONE_IN_MAX = 1.0
const CONE_IN_MIN = 0.0
const LIGHT_TARGET_MIN = 0.2
const LIGHT_TARGET_MAX = 10.0

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
    if( (i == OBJ_IS_LEVER_1  && isReachableLever(1))
        || (i == OBJ_IS_LEVER_3  && isReachableLever(3))
        || (i == OBJ_IS_LEVER_5  && isReachableLever(5))
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


function loadIlluminationParamsFromModel(loadedModel) {
    let numObjects = loadedModel.meshes.length
    let oname;
    //analyze each objects
    for (let i = 0; i < numObjects; i++) {
        oname = loadedModel.rootnode.children[i].name.toLowerCase()
        
        //if it's a lever
        if(oname.startsWith('lever')) {
            //get the number from the name
            let leverNum = parseInt(oname.split('_')[0].substring(5))
            switch(leverNum) {
                case 1:
                    OBJ_IS_LEVER_1 = i
                    break
                case 3:
                    OBJ_IS_LEVER_3 = i
                    break
                case 5:
                    OBJ_IS_LEVER_5 = i
            }
        }
        //if it's a keyhole
         else if(oname.startsWith('keyhole')) {
             //find the type from the name
             let khType = oname.split('-')[1].split('_')[0]
             switch(khType) {
                case 'copper':
                    OBJ_IS_COPP_KEYHOLE = i
                    break
                case 'gold':
                    OBJ_IS_GOLD_KEYHOLE = i
             }
        } 
        //if it's a key
        else if(oname.startsWith('key')) {
            //extract the key type (copper, etc.) by taking the correct part of the full model name (kinda wierd format but that's what we chose as name)
            let keyType = oname.split('-')[1].split('_')[0]
            switch(keyType) {
                case 'copper':
                    OBJ_IS_COPP_KEY = i
                    break
                case 'gold':
                    OBJ_IS_GOLD_KEY = i
             }
        }
    }
}

/**
 * Check if is reachable a specific lever by its number
 * @param {logical number of the lever} num 
 */
function isReachableLever(num) {
    //for each lever, check if is the number searched and if it's reachable
    for (let i = 0; i < reachableLever.length; i++) {
        if(num == levers[i].number && reachableLever[i]) {
            document.getElementById("debugLevers").innerText = "Reachable lever " + num
            return true
        }
    }
    document.getElementById("debugLevers").innerText = "No reachable Lever!"
    return false
}