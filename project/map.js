
/**
 * a tile element of the map. it stores the coordinates of its bounds
 * bounds is in form: [north, east, south, west]
 * these are relative coordinates wrt its center
 */
var Tile = function(hasBounds, bounds) {
    this.hasBounds = hasBounds;
    this.bounds = bounds;
}


/**
 * A lever with the specified number (used to activate a certain door) and coordinates
 * x0 is the minimum x coordinate, x1 the maximum. The same for others. These coordinates are used to describe its boundaries (a box)
 * @param {*} number 
 * @param {*} x0 
 * @param {*} x1 
 * @param {*} y0 
 * @param {*} y1 
 * @param {*} z0 
 * @param {*} z1 
 */
var Lever = function(number, x0, x1, y0, y1, z0, z1) {
    this.number = number
    //boundaries: divided in vertical and horizontal. the horizontal define the bottom of the box which is the hitbox of the lever
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.z0 = z0
    this.z1 = z1
    this.isReachable = function(x, y, z, angleH, angleV, reach) {
        let reachY = Math.sin(degToRad(angleV))*reach
        let reachH = Math.cos(degToRad(angleV))*reach
        let reachX = Math.sin(degToRad(angleH))*reachH
    }
}

const WALL = new Tile(true, [-0.7,0.7,0.7,-0.7])
const FS = new Tile(false, undefined)

var tileMap = {};
var doors = []
var activators = []
const map0Z = startingPoint[0]
const map0X = startingPoint[1]


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
        let tileArgs = string.split('-')
        
    }

    return FS //default last case
}




//FUNCTIONS for working with the tileMap

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
 * @param {the loaded graphical model} objectModel 
 */
function loadElementsFromModel(objectModel) {
    let numObjects = objectModel.meshes.length
    let oname;
    //analyze each objects
    for (let i = 0; i < numObjects; i++) {
        oname = loadedModel.rootnode.children[i].nametoLowerCase()
        
        //if it's a lever
        if(oname.startsWith('lever')) {

        }
    }
}