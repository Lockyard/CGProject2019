/**
 * map.js contains the logic of the game. includes game elements, their hitboxes and methods to update their behavior
 */


var tileMap = {};

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


function tileFromString(string) {
    switch (string) {
        case 'w':
            return WALL
        case 'f':
            return FS
    }

    if(string.startsWith('d')) { //if it's a door, check parameters
        //tileargs has in this case 3 params: 1st is d (no more useful), 2nd is the number, 3rd is its orientation
        let tileArgs = string.split('-')
        //create a new anonymous tile, which has bounds, to be defined next.
        let doorTile = new Tile(true, undefined)
        //create a door and link this tile
        let door = new Door(parseInt(tileArgs[1]), false, doorTile)

        if(tileArgs[2] === 'v') {
            doorTile.bounds = V_DOOR_BOUNDARIES
        }
        else if(tileArgs[2] === 'h') {
            doorTile.bounds = H_DOOR_BOUNDARIES
        }
        else //if its not h or v, discard it and treat it as a free space
            return FS
        //push the doors into the door array, then return the doortile, which is linked to its door
        doors.push(door)
        return doorTile
    }

    return FS //default last case
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

    //check if levers and keys and stuff are reachable (just to print it under canvas, not really useful)
    let allUnreachables = true;
    for (let i = 0; i < levers.length; i++) {
        if(levers[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            document.getElementById("debugElements").innerText = "Lever "+levers[i].number+" reachable!"
            allUnreachables = false
        }
    }
    for (let i = 0; i < keys.length; i++) {
        if(keys[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            document.getElementById("debugElements").innerText = "Key "+keys[i].number+" reachable!"
            allUnreachables = false
        }
    }
    for (let i = 0; i < keyholes.length; i++) {
        if(keyholes[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            document.getElementById("debugElements").innerText = "Keyhole "+keyholes[i].door.number+" reachable!"
            allUnreachables = false
        }
    }
    if(allUnreachables) {document.getElementById("debugElements").innerText = ""}
    //end of reachables check


    //update doors
    for (let i = 0; i < doors.length; i++) {
        doors[i].update(delta)
    }
}


/**
 * perform an inspection action for the player, specifying its position and view
 * @param {player X} pX 
 * @param {player Y} pY 
 * @param {player Z} pZ 
 * @param {player Horizontal Angle} pHA 
 * @param {player vertical Angle} pVA
 */
function playerActionInspect(pX, pY, pZ, pHA, pVA) {
    //activate levers if in reach
    for (let i = 0; i < levers.length; i++) {
        if(levers[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            levers[i].activate(doors)
        }
    }
    //pick up keys if in reach
    for (let i = 0; i < keys.length; i++) {
        if(keys[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            keys[i].pickUp()
        }
    }

    //activate keyholes if in reach
    for (let i = 0; i < keyholes.length; i++) {
        if(keyholes[i].isReachable(pX, pY, pZ, pHA, pVA, PLAYER_REACH)) {
            keyholes[i].openUp()
        }
    }
}





/**
 * get the final x position wrt dungeon tiles
 * @param {The current x} currX 
 * @param {the amount to move on the x axis} amount 
 */
function moveOnX(currX, currZ, amount) {
    let i = Math.floor(currZ+0.5)
    let j = Math.floor(currX+0.5)

    let sameTileBound = sameTileMoveOnX(currX, currZ, i, j, amount)

    if(amount >= 0) { //going right
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next right tile)
        if(currZ > getBound(0, i+1, j+1)) { //if near to the south wall of the next tile
            return Math.min(getBound(3, i, j+1), getBound(3, i+1, j+1), currX+amount, sameTileBound)
        } else 
        if (currZ < getBound(2, i-1, j+1)) { //if near to the north wall of the next tile
            return Math.min(getBound(3, i, j+1), getBound(3, i-1, j+1), currX+amount, sameTileBound)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.min(getBound(3, i, j+1), currX+amount, sameTileBound)
        }

    } else { //going left
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next left tile)
        if(currZ > getBound(0, i+1, j-1)) { //if near to the south wall of the next tile
            return Math.max(getBound(1, i, j-1), getBound(1, i+1, j-1), currX+amount, sameTileBound)
        } else 
        if (currZ < getBound(2, i-1, j-1)) { //if near to the north wall of the next tile
            return Math.max(getBound(1, i, j-1), getBound(1, i-1, j-1), currX+amount, sameTileBound)
        }
        else {//if not near to the wall, return default bound of the next tile to the right 
            return Math.max(getBound(1, i, j-1), currX+amount, sameTileBound)
        }
    }
}

/**
 * Get the final position obtained by moving on x and considering only the bounds on the tile the character is on
 * @param {current X of character} currX 
 * @param {current z of character} currZ 
 * @param {amount moved in x direction (positive/negative)} amount
 */
function sameTileMoveOnX(currX, currZ, i, j, amount) {
    //if the tile has no bounds, return the movement simply of x + amount moved
    if(!tileMap[i][j].hasBounds)
        return currX+amount
    //if going right
    if(amount >= 0) {
        //if the movement on x is not obstacled for sure by bounds of the tile, go on
        if(currX >= getBound(1, i, j) || currZ >= getBound(2, i, j) || currZ <= getBound(0, i, j)) {
            return currX + amount
        }
        else {//else return the minimum between the free movement and the obstacled one by the west wall
            return Math.min(currX + amount, getBound(3, i, j))
        }
    }
    //going left 
    else {
        //if the movement on x is not obstacled for sure by bounds of the tile, go on
        if(currX <= getBound(3, i, j) || currZ >= getBound(2, i, j) || currZ <= getBound(0, i, j)) {
            return currX + amount
        }
        else //else return the minimum between the free movement and the obstacled one by the east wall
            return Math.max(currX + amount, getBound(1, i, j))
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

    let sameTileBound = sameTileMoveOnZ(currX, currZ, i, j, amount)

    if(amount >= 0) { //going down
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next south tile)
        if(currX > getBound(3, i+1, j+1)) { //if near to the east wall of the next tile
            return Math.min(getBound(0, i+1, j), getBound(0, i+1, j+1), currZ+amount, sameTileBound)
        } else 
        if (currX < getBound(1, i+1, j-1)) { //if near to the west wall of the next tile
            return Math.min(getBound(0, i+1, j), getBound(0, i+1, j-1), currZ+amount, sameTileBound)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.min(getBound(0, i+1, j), currZ+amount, sameTileBound)
        }

    } else { //going up
        //if near to the wall, consider also the bound of the near tile (up or down wrt to the next north tile)
        if(currX > getBound(3, i-1, j+1)) { //if near to the east wall of the next tile
            return Math.max(getBound(2, i-1, j), getBound(2, i-1, j+1), currZ+amount, sameTileBound)
        } else 
        if (currX < getBound(1, i-1, j-1)) { //if near to the west wall of the next tile
            return Math.max(getBound(2, i-1, j), getBound(2, i-1, j-1), currZ+amount, sameTileBound)
        }
        else {//if not near to the wall, return default bound of the next tile to the right
            return Math.max(getBound(2, i-1, j), currZ+amount, sameTileBound)
        }
    }
}

/**
 * Get the final position obtained by moving on z and considering only the bounds on the tile the character is on
 * @param {current X of character} currX 
 * @param {current z of character} currZ 
 * @param {amount moved in x direction (positive/negative)} amount
 */
function sameTileMoveOnZ(currX, currZ, i, j, amount) {
    //if the tile has no bounds, return the movement simply of z + amount moved
    if(!tileMap[i][j].hasBounds)
        return currZ+amount
    //if going down
    if(amount >= 0) {
        //if the movement on z is not obstacled for sure by bounds of the tile, go on
        if(currZ >= getBound(2, i, j) || currX <= getBound(3, i, j) || currX >= getBound(1, i, j)) {
            return currZ + amount
        }
        else //else return the minimum between the free movement and the obstacled one by the north wall
            return Math.min(currZ + amount, getBound(0, i, j))
    }
    //going up
    else {
        //if the movement on z is not obstacled for sure by bounds of the tile, go on
        if(currZ <= getBound(0, i, j) || currX <= getBound(3, i, j) || currX >= getBound(1, i, j)) {
            return currZ + amount
        }
        else //else return the minimum between the free movement and the obstacled one by the south wall
            return Math.max(currZ + amount, getBound(2, i, j))
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
    let keyholesToBind = []
    //analyze each objects
    for (let i = 0; i < numObjects; i++) {
        oname = loadedModel.rootnode.children[i].name.toLowerCase()
        
        //if it's a lever
        if(oname.startsWith('lever')) {
            //get the number from the name
            let leverNum = parseInt(oname.split('_')[0].substring(5))
            console.log("lever found! ->"+oname+ ", number: "+leverNum)
            let bounds = getMinMaxAxisBounds(loadedModel.meshes[i].vertices) //calculate bounds
            levers.push(new Lever(leverNum, false, bounds[0], bounds[1], bounds[2], bounds[3], bounds[4], bounds[5]))
            console.log("added lever with bounds: " + bounds)
        }
        //if it's a keyhole
         else if(oname.startsWith('keyhole')) {
             //find the number and type from the name
             let khNum = parseInt(oname.split('-')[0].substring(7))
             let khType = oname.split('-')[1].split('_')[0]
             console.log("keyhole found! ->"+oname+ ", number: "+khNum + ", type: "+khType)
             let bounds = getMinMaxAxisBounds(loadedModel.meshes[i].vertices) //calculate bounds
             let kh = new Keyhole(undefined, false, khType, bounds[0], bounds[1], bounds[2], bounds[3], bounds[4], bounds[5])

             //push the new keyhole in the array of keyholes and in the one used to bind later to it its door, because it could not be in the doors array yet
             keyholes.push(kh)
             keyholesToBind.push({keyhole: kh, num: khNum})
        } 
        //if it's a key
        else if(oname.startsWith('key')) {
            let keyNum = parseInt(oname.split('-')[0].substring(3))
            //extract the key type (copper, etc.) by taking the correct part of the full model name (kinda wierd but that's what we chose as name)
            let keyType = oname.split('-')[1].split('_')[0]
            console.log("key found! ->"+oname+", number: "+keyNum + ", type: "+keyType)
            let bounds = getMinMaxAxisBounds(loadedModel.meshes[i].vertices)
            keys.push(new Key(keyNum, false, keyType, bounds[0], bounds[1], bounds[2], bounds[3], bounds[4], bounds[5]))
        }
    }

    //at the end, when everything is loaded, bind keyholes to doors
    for (let i = 0; i < keyholesToBind.length; i++) {
        for (let j = 0; j < doors.length; j++) {
            if(keyholesToBind[i].num == doors[j].number) { //if the keyhole's num matches the door's one, bind the keyhole to the door
                keyholesToBind[i].keyhole.door = doors[j]
            }
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