
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

    //update the alpha for the scale
    for (let i = 0; i < torchNodes.length; i++) {
        //move flame to (0,0,0) position, scale it and move again to original position
        let zeroMatrix = utils.MakeTranslateMatrix(-torchlightsPositions[i*3], -torchlightsPositions[i*3+1], -torchlightsPositions[i*3+2])
        zeroMatrix = utils.multiplyMatrices(utils.MakeScaleMatrix(torchlightsFlickerAmounts || 1), zeroMatrix)
        zeroMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(torchlightsPositions[i*3], torchlightsPositions[i*3+1], torchlightsPositions[i*3+2]), zeroMatrix)
        torchNodes[i].localMatrix = zeroMatrix
    }

}
