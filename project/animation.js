const LEVER_ROT_ANGLE = 90.0 //degrees

//definitions of animations
//4 states of animation of a lever
const LEVER_ANIM_DEF = [0.0, -0.25, 0.1, 1.0]

const KEY_TO_DOOR_ANIM_DEF = [0.0, 0.05, 0.15, 1.0]

const KEY_ROTATING_ANIM_DEF = [0.0, -0.2, 0.08, 1.0]

//arrays used only for animation
var torchNodes = []

/**
 * Bind nodes to their related thing
 * @param {*} doorNum 
 * @param {*} node 
 */
function bindNodeToDoor(doorNum, node) {
    for (let i = 0; i < doors.length; i++) {
        if(doors[i].number == doorNum) {
            doors[i].node = node
        }
    }
}

function bindNodeToKey(keyNum, node) {
    for (let i = 0; i < keys.length; i++) {
        if(keys[i].number == keyNum) {
            keys[i].node = node
        }
    }
}

function bindNodeToKeyhole(keyholeNum, node) {
    for (let i = 0; i < keyholes.length; i++) {
        if(keyholes[i].door.number == keyholeNum) {
            keyholes[i].node = node
        }
    }
}

function bindNodeToLever(leverNum, node) {
    for (let i = 0; i < levers.length; i++) {
        if(levers[i].number == leverNum) {
            levers[i].node = node
        }
    }
}

function bindNodeToFire(torchNum, node) {
    torchNodes.push(node)
}


function updateAnimations() {
    //update doors
    for (let i = 0; i < doors.length; i++) {
        doors[i].node.localMatrix = utils.MakeTranslateMatrix(0, doors[i].yOpen, 0)
    }

    //update keys
    for (let i=0; i< keys.length; i++) {
        if(keys[i].isInAnimation) {
            //anim. 1: key picked up
            if(keys[i].animationNum == 1) {
                let zeroMatrix = utils.MakeTranslateMatrix(-keys[i].startX, -keys[i].startY, -keys[i].startZ)
                zeroMatrix = utils.multiplyMatrices(utils.MakeScaleMatrix(1.1-keys[i].alphaAnimation), zeroMatrix)
                keys[i].node.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(keys[i].x, keys[i].y, keys[i].z),zeroMatrix)
            }
            //anim. 2: key going into door
            else if(keys[i].animationNum == 2) {
                let zeroMatrix = utils.MakeTranslateMatrix(-keys[i].startX, -keys[i].startY, -keys[i].startZ)
                let rotMatrix
                let transAnimationMatrix
                if(keys[i].keyhole.faceDirection == 0) { //north: rotate on x then y
                    rotMatrix = utils.multiplyMatrices(utils.MakeRotateYMatrix(90.0), utils.MakeRotateXMatrix(90.0))
                    transAnimationMatrix = utils.MakeTranslateMatrix(   keys[i].x, keys[i].y,
                                                                        Bezier3(    lerp(keys[i].z,keys[i].keyhole.z,KEY_TO_DOOR_ANIM_DEF[0]),
                                                                                    lerp(keys[i].z,keys[i].keyhole.z,KEY_TO_DOOR_ANIM_DEF[1]),
                                                                                    lerp(keys[i].z,keys[i].keyhole.z,KEY_TO_DOOR_ANIM_DEF[2]),
                                                                                    lerp(keys[i].z,keys[i].keyhole.z,KEY_TO_DOOR_ANIM_DEF[3]),
                                                                                    keys[i].alphaAnimation
                                                                        ))
                } else if(keys[i].keyhole.faceDirection == 3) { //north: rotate on x
                    rotMatrix = utils.MakeRotateXMatrix(90.0)
                    transAnimationMatrix = utils.MakeTranslateMatrix(   Bezier3(    lerp(keys[i].x,keys[i].keyhole.x,KEY_TO_DOOR_ANIM_DEF[0]),
                                                                                    lerp(keys[i].x,keys[i].keyhole.x,KEY_TO_DOOR_ANIM_DEF[1]),
                                                                                    lerp(keys[i].x,keys[i].keyhole.x,KEY_TO_DOOR_ANIM_DEF[2]),
                                                                                    lerp(keys[i].x,keys[i].keyhole.x,KEY_TO_DOOR_ANIM_DEF[3]),
                                                                                    keys[i].alphaAnimation
                                                                        ), 
                                                                        keys[i].y, keys[i].z
                                                                        )
                }
                else {//the other cases are not considered only because there are no doors facing 2 and 1. It should be done in general
                    rotMatrix = utils.identityMatrix()
                    transAnimationMatrix = utils.identityMatrix()
                }
                zeroMatrix = utils.multiplyMatrices(rotMatrix, zeroMatrix)
                keys[i].node.localMatrix = utils.multiplyMatrices(transAnimationMatrix, zeroMatrix)
            }//animation 3, rotating in keyhole 
            else if (keys[i].animationNum == 3) {
                let zeroMatrix = utils.MakeTranslateMatrix(-keys[i].startX, -keys[i].startY, -keys[i].startZ)
                let rotMatrix
                let rotAniMatrix
                if(keys[i].keyhole.faceDirection == 0) { //if keyhole faces north
                    rotMatrix = utils.multiplyMatrices(utils.MakeRotateYMatrix(90.0), utils.MakeRotateXMatrix(90.0))
                    rotAniMatrix = BezierQuaternion(    new Quaternion(1.0, 0.0, 0.0, KEY_ROTATING_ANIM_DEF[0]), 
                                                        new Quaternion(1.0, 0.0, 0.0, KEY_ROTATING_ANIM_DEF[1]),
                                                        new Quaternion(1.0, 0.0, 0.0, KEY_ROTATING_ANIM_DEF[2]), 
                                                        new Quaternion(1.0, 0.0, 0.0, KEY_ROTATING_ANIM_DEF[3]), 
                                                        keys[i].alphaAnimation)
                                    .toMatrix4();
                }
                else if(keys[i].keyhole.faceDirection == 3){ //if keyhole faces west
                    rotMatrix = utils.MakeRotateXMatrix(90.0)
                    rotAniMatrix = BezierQuaternion(    new Quaternion(1.0, KEY_ROTATING_ANIM_DEF[0], 0.0, 0.0), 
                                                        new Quaternion(1.0, KEY_ROTATING_ANIM_DEF[1], 0.0, 0.0),
                                                        new Quaternion(1.0, KEY_ROTATING_ANIM_DEF[2], 0.0, 0.0), 
                                                        new Quaternion(1.0, KEY_ROTATING_ANIM_DEF[3], 0.0, 0.0), 
                                                        keys[i].alphaAnimation)
                                    .toMatrix4();
                } else { //if keyhole faces other directions (not implemented because there are not. In general this should be done but it's just a matter of reusing bezier with opposite signs)
                    rotMatrix = utils.identityMatrix()
                    rotAniMatrix = utils.identityMatrix()
                }

                zeroMatrix = utils.multiplyMatrices(rotAniMatrix, utils.multiplyMatrices(rotMatrix, zeroMatrix))
                keys[i].node.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(keys[i].x, keys[i].y, keys[i].z), zeroMatrix)
            }
        }
    }

    //update the scale of torch flames
    for (let i = 0; i < torchNodes.length; i++) {
        //move flame to (0,0,0) position, scale it and move again to original position
        let zeroMatrix = utils.MakeTranslateMatrix(-torchlightsPositions[i*3], -torchlightsPositions[i*3+1], -torchlightsPositions[i*3+2])
        zeroMatrix = utils.multiplyMatrices(utils.MakeScaleMatrix(torchlightsFlickerAmounts || 1), zeroMatrix)
        zeroMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(torchlightsPositions[i*3], torchlightsPositions[i*3+1], torchlightsPositions[i*3+2]), zeroMatrix)
        torchNodes[i].localMatrix = zeroMatrix
    }

    //update levers
    for (let i=0; i<levers.length; i++) {
        let zeroMatrix = utils.MakeTranslateMatrix(-levers[i].centerPosition[0], -levers[i].centerPosition[1], -levers[i].centerPosition[2])
        let rotMatrix
        switch (levers[i].faceDirection) {
            case 0: //north
                rotMatrix = BezierQuaternion(   new Quaternion(1.0, -LEVER_ANIM_DEF[0], 0.0, 0.0), 
                                                new Quaternion(1.0, -LEVER_ANIM_DEF[1], 0.0, 0.0),
                                                new Quaternion(1.0, -LEVER_ANIM_DEF[2], 0.0, 0.0), 
                                                new Quaternion(1.0, -LEVER_ANIM_DEF[3], 0.0, 0.0), 
                                                levers[i].alphaRotation)
                                .toMatrix4();
                break
            case 1: //east
                rotMatrix = BezierQuaternion(   new Quaternion(1.0, 0.0, 0.0, -LEVER_ANIM_DEF[0]), 
                                                new Quaternion(1.0, 0.0, 0.0, -LEVER_ANIM_DEF[1]),
                                                new Quaternion(1.0, 0.0, 0.0, -LEVER_ANIM_DEF[2]),
                                                new Quaternion(1.0, 0.0, 0.0, -LEVER_ANIM_DEF[3]),
                                                levers[i].alphaRotation)
                            .toMatrix4();
                break
            case 2: //south
                rotMatrix = BezierQuaternion(   new Quaternion(1.0, LEVER_ANIM_DEF[0], 0.0, 0.0), 
                                                new Quaternion(1.0, LEVER_ANIM_DEF[1], 0.0, 0.0),
                                                new Quaternion(1.0, LEVER_ANIM_DEF[2], 0.0, 0.0), 
                                                new Quaternion(1.0, LEVER_ANIM_DEF[3], 0.0, 0.0), 
                                                levers[i].alphaRotation)
                            .toMatrix4();
                break
            case 3: //west
                rotMatrix = BezierQuaternion(   new Quaternion(1.0, 0.0, 0.0, LEVER_ANIM_DEF[0]), 
                                                new Quaternion(1.0, 0.0, 0.0, LEVER_ANIM_DEF[1]),
                                                new Quaternion(1.0, 0.0, 0.0, LEVER_ANIM_DEF[2]),
                                                new Quaternion(1.0, 0.0, 0.0, LEVER_ANIM_DEF[3]),
                                                levers[i].alphaRotation)
                            .toMatrix4()
        }
        zeroMatrix = utils.multiplyMatrices(rotMatrix, zeroMatrix)
        zeroMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(levers[i].centerPosition[0], levers[i].centerPosition[1], levers[i].centerPosition[2]), zeroMatrix)
        levers[i].node.localMatrix = zeroMatrix
    }

}



/**
*	Implementation of a simple Bezier of degree 3
*/
function Bezier3(x0, x1, x2, x3, alpha) {
    let x01 = lerp(x0, x1, alpha)
    let x12 = lerp(x1, x2, alpha)
    let x23 = lerp(x2, x3, alpha)
    let x012 = lerp(x01, x12, alpha)
    let x123 = lerp(x12, x23, alpha)
    return lerp(x012, x123, alpha)
}

function lerp(x1, x2, alpha) {
	return x1*(1-alpha) + x2*alpha
}

//performs a Bezier curve for quaternions using Quaternions objects
function BezierQuaternion(q0, q1, q2, q3, alpha) {
	var q01 = q0.slerp(q1)(alpha)
	var q12 = q1.slerp(q2)(alpha)
	var q23 = q2.slerp(q3)(alpha)
	var q012 = q01.slerp(q12)(alpha)
	var q123 = q12.slerp(q23)(alpha)
	return q012.slerp(q123)(alpha)
}