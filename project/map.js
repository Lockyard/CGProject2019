//a tile element of the map. it stores its type and the coordinates of its bounds
//bounds is in form: [north, east, south, west] and are relative coordinates wrt its center
var Tile = function(type, hasBounds, bounds) {
    this.type = type
    this.hasBounds = hasBounds;
    this.bounds = bounds;
}

//Tile.prototype

const WALL = new Tile(1, true, [-0.6,0.6,0.6,-0.6])
const FS = new Tile(0, false, undefined)

var tileMap = {};
var map0Z = startingPoint[0]
var map0X = startingPoint[1]


//Actions performed by this js ////////////////////////////////
setupTileMap()




//Functions ///////////////////////////

function setupTileMap() {
    console.log(mapAsterix)
    for (let i = 0; i < mapAsterix.length; i++) {
        tileMap[i] = []
        for (let j = 0; j < mapAsterix[0].length; j++) {
            tileMap[i][j] = tileFromString(mapAsterix[i][j])
        }
    }
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
    let i = Math.floor(currZ+map0Z+0.5)
    let j = Math.floor(currX+map0X+0.5)
    console.log("move on X. i:"+i+", j:"+j)
    console.log("getBound on x right: "+Math.min(getBound(1, i, j+1)))

    if(amount >= 0) { //going right
        return Math.min(getBound(1, i, j+1), currX+amount)
    } else { //going left
        return Math.max(getBound(3, i, j-1), currX+amount)
    }
}

/**
 * get the final x position wrt dungeon tiles
 * @param {The current Z} currZ 
 * @param {the amount to move on the x axis} amount 
 */
function moveOnZ(currX, currZ, amount) {
    let i = Math.floor(currZ+map0Z+0.5)
    let j = Math.floor(currX+map0X+0.5)
    console.log("move on Z. i:"+i+", j:"+j)

    if(amount >= 0) { //going down
        return Math.min(getBound(2, i+1, j), currZ+amount)
    } else { //going up
        return Math.max(getBound(0, i-1, j), currZ+amount)
    }
}

/**
 * Returns the bound of the tile in the specified direction in the specified place in the map
 * @param {from 0 to 3. north, east, south, west, in order} direction 
 * @param {*} i 
 * @param {*} j 
 */
function getBound(direction, i, j) {
    console.log("Get bound. dir:"+direction+", i:"+i+", j:"+j)
    console.log("tileMap[i][j]:")
    console.log(tileMap[i][j])
    if (tileMap[i][j].hasBounds) {
        if(direction == 0 || direction == 2)
            return j+tileMap[i][j].bounds[direction]
        else
            return i+tileMap[i][j].bounds[direction]
    } else { //if the tile is free give a long bound which is like no bound
        switch (direction) {
            case 0: //north
                return -1000
            case 1: //east
                return 1000
            case 2: //south
                return 1000
            case 3:
                return -1000
        }
    }
}