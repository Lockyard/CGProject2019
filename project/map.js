
/**
 * a tile element of the map. it stores its type and the coordinates of its bounds
 * bounds is in form: [north, east, south, west]
 * these are relative coordinates wrt its center
 */
var Tile = function(type, hasBounds, bounds) {
    this.type = type
    this.hasBounds = hasBounds;
    this.bounds = bounds;
}

//Tile.prototype

const WALL = new Tile(1, true, [-0.7,0.7,0.7,-0.7])
const FS = new Tile(0, false, undefined)

var tileMap = {};
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
        default:
            return FS
    }
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