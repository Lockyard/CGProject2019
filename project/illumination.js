//Constants for finding specific objects (are vars because must be initialized but are in fact constants)
var OBJ_IS_COPP_KEY_2
var OBJ_IS_GOLD_KEY_4
var OBJ_IS_KEY_2    //copper
var OBJ_IS_KEY_4    //gold
var OBJ_IS_KEYHOLE_2 //copper
var OBJ_IS_KEYHOLE_4 //gold
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

//params for fire lights of torches
var torchlightsPositions = new Array()
var torchlightColor = new Float32Array([1.0, 0.7, 0.1, 1.0]);
var torchlightDecay = 1.5
var torchlightTarget = 0.5

//all these arrays are used to check if something is reachable/carried. Are initialized in the load from model function and use indices
//bound to the element number they refer to
var reachableLever = [];
var reachableKey = [];
var reachableKeyHole = [];
var carryingKey = [];

var flag = 0;
var colorInfluence = 0.0;
var delta = 1.0;

/**
 *  This function will check if the conditions for illuminating a reachable object are met
 *  and act on consequence
 *  @param {index of the mesh we are considering} i
 */
function illuminateReachableObjects(i){
    if( (i == OBJ_IS_LEVER_1  && reachableLever[1])
        || (i == OBJ_IS_LEVER_3  && reachableLever[3])
        || (i == OBJ_IS_LEVER_5  && reachableLever[5])
        || (i == OBJ_IS_KEY_2 && reachableKey[2] && !carryingKey[2])
        || (i == OBJ_IS_KEY_4 && reachableKey[4] && !carryingKey[4])
        || (i == OBJ_IS_KEYHOLE_2 && reachableKeyHole[2] && carryingKey[2])
        || (i == OBJ_IS_KEYHOLE_4 && reachableKeyHole[4] && carryingKey[4])
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
    if (colorInfluence <= 0.1)
        flag = 0;
    else if (colorInfluence >= 0.4)
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

/**
 * Use the model to load parameters used for illumination
 * @param {*} loadedModel 
 */
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
            reachableLever[leverNum] = false
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
             //find the number from the name
             let khNum = parseInt(oname.split('-')[0].substring(7))

             reachableKeyHole[khNum] = false

             switch(khNum) {
                case 2:
                    OBJ_IS_KEYHOLE_2 = i
                    break
                case 4:
                    OBJ_IS_KEYHOLE_4 = i
                    
             }
        } 
        //if it's a key
        else if(oname.startsWith('key')) {
            let keyNum = parseInt(oname.split('-')[0].substring(3))
            reachableKey[keyNum] = false
            carryingKey[keyNum] = false

            switch(keyNum) {
                case 2:
                    OBJ_IS_KEY_2 = i
                    break
                case 4:
                    OBJ_IS_KEY_4 = i
                    
             }
        }
        //if it's a fire of a torch
        else if(oname.startsWith('fire')) {
            //get the mean value of vertices to get its position for its light
            let position = utils.getMeanXYZ(loadedModel.meshes[i].vertices)
            torchlightsPositions.push(position[0])
            torchlightsPositions.push(position[1])
            torchlightsPositions.push(position[2])
            console.log('added fire:'+oname+" in: ("+position[0]+","+position[1]+","+position[2]+")")
        }
    }
}
