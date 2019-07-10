//Constants for finding specific objects
const OBJ_IS_COPP_KEY = 0;
const OBJ_IS_GOLD_KEY = 1;
const OBJ_IS_GOLD_KEYHOLE = 3;
const OBJ_IS_COPP_KEYHOLE = 4;
const OBJ_IS_LEVER_1 = 5;
const OBJ_IS_LEVER_2 = 6;
const OBJ_IS_LEVER_3 = 7;

var reachableLever = [];

var lastUpdateTime = 0;
var flag = 0;
var colorInfluence = 0.0;

/**
 *  This function will check if the conditions for illuminating a reachable object are met
 *  and act on consequence
 *  @param {index of the mesh we are considering} i
 */
function illuminateReachableObjects(i){
    if( (i == OBJ_IS_LEVER_1 /* && reachableLever[1] */)
        || (i == OBJ_IS_LEVER_2 /* && reachableLever[2]*/)
        || (i == OBJ_IS_LEVER_3 /* && reachableLever[3]*/)
    ) {
        //console.log("Hi, I'm lever n: " + i + "   " + loadedModel.rootnode.children[i].name);
        gl.uniform1f(lightUpObjectHandle, 1.0);
        gl.uniform1f(lightUpPercentageHandle, animateObjectLight());
        //gl.bind(lightUpObjectHandle, true);
    }else {
        gl.uniform1f(lightUpObjectHandle, 0.0);
        gl.uniform1f(lightUpPercentageHandle, 0.0);
        //gl.uniform1f(lightUpObjectHandle, false);
    }

}

function animateObjectLight(){
    var currentTime = (new Date).getTime();
    if(lastUpdateTime){
        var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
    if (flag == 0)
        colorInfluence += deltaC/100;
    else
        colorInfluence -= deltaC/100;
    if (colorInfluence <= 0.001)
        flag = 0;
    else if (colorInfluence >= 0.150)
        flag = 1;
    }
    lastUpdateTime = currentTime;
    //console.log("Color influence: "+colorInfluence);
    return colorInfluence;
}