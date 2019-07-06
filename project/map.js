var tileMap = {};
var doors = []
var levers = []
const map0Z = startingPoint[0]
const map0X = startingPoint[1]

const PLAYER_REACH = 0.7 //the distance in which the player can interact with things


//Actions performed by this js ////////////////////////////////
setupTileMap()




//Functions ///////////////////////////

function setupTileMap() {
    console.log(mapAsterix)
    for (let i = -map0Z; i < mapAsterix.length-map0Z; i++) {
        tileMap[i] = []
        for (let j = -map0X; j < mapAsterix[0].length-map0X; j++) {
            tileMap[i][j] = tileFromString(mapAsterix[i+map0Z][j+map0X])
        }
    }
    console.log(tileMap)
    //"dispose" the map asterix strings
    mapAsterix = undefined
}




//FUNCTIONS for working with the tileMap

/**
 * Update the map logic according to delta and player position
 * @param {*} delta 
 * @param {player X} pX 
 * @param {player Y} pY 
 * @param {player Z} pZ 
 * @param {player Horizontal Angle} pHA 
 * @param {player vertical Angle} pVA
 */
function updateMap(delta, pX, pY, pZ, pHA, pVA) {
    let unreachablelevers = true;
    for (let i = 0; i < levers.length; i++) {
        if(levers[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            document.getElementById("debugElements").innerText = "Lever "+levers[i].number+" reachable!"
            unreachablelevers = false
        }
    }
    if(unreachablelevers) {document.getElementById("debugElements").innerText = ""}
}



/**
 * get the final x position wrt dungeon tiles
 * @param {The current x} currX 
 * @param {the amount to move on the x axis} amount 
 */
function moveOnX(currX, currZ, amount) {
    let i = Math.floor(currZ+0.5)
    let j = Math.floor(currX+0.5)

    if(amount >= 0) { //going right
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next right tile)
        if(currZ > getBound(0, i+1, j+1)) { //if near to the south wall of the next tile
            return Math.min(getBound(3, i, j+1), getBound(3, i+1, j+1), currX+amount)
        } else 
        if (currZ < getBound(2, i-1, j+1)) { //if near to the north wall of the next tile
            return Math.min(getBound(3, i, j+1), getBound(3, i-1, j+1), currX+amount)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.min(getBound(3, i, j+1), currX+amount)
        }

    } else { //going left
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next left tile)
        if(currZ > getBound(0, i+1, j-1)) { //if near to the south wall of the next tile
            return Math.max(getBound(1, i, j-1), getBound(1, i+1, j-1), currX+amount)
        } else 
        if (currZ < getBound(2, i-1, j-1)) { //if near to the north wall of the next tile
            return Math.max(getBound(1, i, j-1), getBound(1, i-1, j-1), currX+amount)
        }
        else {//if not near to the wall, return default bound of the next tile to the right 
            return Math.max(getBound(1, i, j-1), currX+amount)
        }
    }
}

/**
 * get the final x position wrt dungeon tiles
 * @param {The current Z} currZ 
 * @param {the amount to move on the x axis} amount 
 */
function moveOnZ(currX, currZ, amount) {
    let i = Math.floor(currZ+0.5)
    let j = Math.floor(currX+0.5)

    if(amount >= 0) { //going down
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next south tile)
        if(currX > getBound(3, i+1, j+1)) { //if near to the east wall of the next tile
            return Math.min(getBound(0, i+1, j), getBound(0, i+1, j+1), currZ+amount)
        } else 
        if (currX < getBound(1, i+1, j-1)) { //if near to the west wall of the next tile
            return Math.min(getBound(0, i+1, j), getBound(0, i+1, j-1), currZ+amount)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.min(getBound(0, i+1, j), currZ+amount)
        }

    } else { //going up
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next north tile)
        if(currX > getBound(3, i-1, j+1)) { //if near to the east wall of the next tile
            return Math.max(getBound(2, i-1, j), getBound(2, i-1, j+1), currZ+amount)
        } else 
        if (currX < getBound(1, i-1, j-1)) { //if near to the west wall of the next tile
            return Math.max(getBound(2, i-1, j), getBound(2, i-1, j-1), currZ+amount)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.max(getBound(2, i-1, j), currZ+amount)
        }
    }
}

/**
 * Returns the bound of the tile in the specified direction in the specified place in the map
 * @param {from 0 to 3. north, east, south, west, in order} direction 
 * @param {*} i 
 * @param {*} j 
 */
function getBound(direction, i, j) {
    if (tileMap[i][j].hasBounds) {
        if(direction == 0 || direction == 2) {
            return i+tileMap[i][j].bounds[direction]
        }
        else {
            return j+tileMap[i][j].bounds[direction]
        }
    } else { //if the tile is free give a long bound which is like no bound
        switch (direction) {
            case 0: //north
                return 1000
            case 1: //east
                return -1000
            case 2: //south
                return -1000
            case 3:
                return 1000
        }
    }
}

/**
 * Load at a logic level some objects based on their model in the overall model
 * @param {the loaded graphical model} loadedModel 
 */
function loadElementsFromModel(loadedModel) {
    let numObjects = loadedModel.meshes.length
    let oname;
    //analyze each objects
    for (let i = 0; i < numObjects; i++) {
        oname = loadedModel.rootnode.children[i].name.toLowerCase()
        
        //if it's a lever
        if(oname.startsWith('lever')) {
            console.log("lever found! ->"+oname)
            let leverNum = parseInt(oname.substring(5,6))
            console.log("lever number: "+leverNum)
            let bounds = getMinMaxAxisBounds(loadedModel.meshes[i].vertices)
            levers.push(new Lever(leverNum, bounds[0], bounds[1], bounds[2], bounds[3], bounds[4], bounds[5]))
            console.log("added lever with bounds: " + bounds)
        }
    }
}

/**
 * return an array containing [minX, maxX, minY, maxY, minZ, maxZ] from the given array
 * assuming that positions modulo 0 are x, mod 1 are y and mod 2 z
 * 
 * @param {the array, must be long a multiple of 3} array3x 
 */
function getMinMaxAxisBounds(array3x) {
    let er = array3x.length % 3 //to avoid errors in case of non mul-3 arrays. Still shouldn't happen
    //array of minMax results. initialized to be overrwitten by any value at first
    let minMaxA = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    for(let i = 0; i < array3x.length - er; i+=3) {
        //check max and mins for x
        if (array3x[i] < minMaxA[0]) minMaxA[0] = array3x[i]
        else if (array3x[i] > minMaxA[1]) minMaxA[1] = array3x[i]
        //check max and mins for y
        if (array3x[i+1] < minMaxA[2]) minMaxA[2] = array3x[i+1]
        else if (array3x[i+1] > minMaxA[3]) minMaxA[3] = array3x[i+1]
        //check max and mins for z
        if (array3x[i+2] < minMaxA[4]) minMaxA[4] = array3x[i+2]
        else if (array3x[i+2] > minMaxA[5]) minMaxA[5] = array3x[i+2]
    }
    return minMaxA
}