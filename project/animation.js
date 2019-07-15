const LEVER_ROT_ANGLE = 90.0 //degrees

//definitions of animations
//animation of a lever facing 2 (south)
const LEVER_ANIM_DEF_2 = [
    new Quaternion(1.0, 0.0,    0.0,    0.0),   //q0
    new Quaternion(1.0, -0.25,  0.0,    0.0),   //q1
    new Quaternion(1.0, 0.1,    0.0,    0.0),   //q2
    new Quaternion(1.0, 1.0,    0.0,    0.0)    //q3
]
//animation of a lever facing 3 (west)
const LEVER_ANIM_DEF_3 = [
    new Quaternion(1.0, 0.0,    0.0,    0.0),   //q0
    new Quaternion(1.0, 0.0,    0.0,    -0.25),   //q1
    new Quaternion(1.0, 0.0,    0.0,    0.1),   //q2
    new Quaternion(1.0, 0.0,    0.0,    1.0)    //q3
]
//since no levers face other directions, no definition needed. When managing animation, a default "follow-alpha" policy would be used
//(namely: there's no smooth animation but the lever still would rotate correctly)

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
        if(keyholes[i].number == keyholeNum) {
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

    //update the scale
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
                rotMatrix = utils.MakeRotateXMatrix(-levers[i].alphaRotation*LEVER_ROT_ANGLE)
                break
            case 1: //east
                rotMatrix = utils.MakeRotateZMatrix(levers[i].alphaRotation*LEVER_ROT_ANGLE)
                break
            case 2: //south
                rotMatrix = BezierQuaternion(LEVER_ANIM_DEF_2[0], LEVER_ANIM_DEF_2[1], LEVER_ANIM_DEF_2[2], LEVER_ANIM_DEF_2[3], levers[i].alphaRotation).toMatrix4()
                break
            case 3: //west
                rotMatrix = BezierQuaternion(LEVER_ANIM_DEF_3[0], LEVER_ANIM_DEF_3[1], LEVER_ANIM_DEF_3[2], LEVER_ANIM_DEF_3[3], levers[i].alphaRotation).toMatrix4()
        }
        zeroMatrix = utils.multiplyMatrices(rotMatrix, zeroMatrix)
        zeroMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(levers[i].centerPosition[0], levers[i].centerPosition[1], levers[i].centerPosition[2]), zeroMatrix)
        levers[i].node.localMatrix = zeroMatrix
    }

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