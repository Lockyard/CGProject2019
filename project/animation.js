const LEVER_ROT_ANGLE = 90.0 //degrees

//definitions of animations
//4 states of animation of a lever
const LEVER_ANIM_DEF = [0.0, -0.25, 0.1, 1.0]

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

    //update keys
    for (let i=0; i< keys.length; i++) {
        if(keys[i].isInAnimation) {
            keys[i].node.localMatrix = utils.MakeTranslateMatrix(keys[i].relativeX(), keys[i].relativeY(), keys[i].relativeZ())
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


//performs a Bezier curve for quaternions using Quaternions objects
function BezierQuaternion(q0, q1, q2, q3, alpha) {
	var q01 = q0.slerp(q1)(alpha)
	var q12 = q1.slerp(q2)(alpha)
	var q23 = q2.slerp(q3)(alpha)
	var q012 = q01.slerp(q12)(alpha)
	var q123 = q12.slerp(q23)(alpha)
	return q012.slerp(q123)(alpha)
}