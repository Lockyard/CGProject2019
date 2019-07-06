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
    //check if this lever is reachable from given position and angles with a reach length
    this.isReachable = function(x, y, z, angleH, angleV, reach) {
        //check on y
        let reachY = Math.sin(utils.degToRad(angleV))*reach
        if(reachY >= 0) {
            if(y > y1 || (y+reachY) < y0)
                return false
        } else {
            if(y < y0 || (y+reachY) > y1)
                return false
        }

        //check on x
        let reachH = Math.cos(utils.degToRad(angleV))*reach
        let reachX = Math.sin(utils.degToRad(angleH))*reachH
        if(reachX >= 0) {
            if(x > x1 || (x+reachX) < x0)
                return false
        } else {
            if(x < x0 || (x+reachX) > x1)
                return false
        }

        //check on z
        let reachZ = -Math.cos(utils.degToRad(angleH))*reachH
        if(reachZ >= 0) {
            if(z > z1 || (z+reachZ) < z0)
                return false
        } else {
            if(z < z0 || (z+reachZ) > z1)
                return false
        }

        //if all check passed, then lever is reachable
        return true
    }
}

const WALL = new Tile(true, [-0.7,0.7,0.7,-0.7])
const FS = new Tile(false, undefined)


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