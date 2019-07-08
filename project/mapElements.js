/**
 * mapElements.js contains definitions of elements/objects used in the game logic
 */



/**
 * a tile element of the map. it stores the coordinates of its bounds
 * bounds is in form: [north, east, south, west]
 * these are relative coordinates wrt its center
 */
var Tile = function(hasBounds, bounds) {
    this.hasBounds = hasBounds;
    this.bounds = bounds;
}

//wall and free space, basic tiles
const WALL = new Tile(true, [-0.7,0.7,0.7,-0.7])
const FS = new Tile(false, undefined)

//boundaries for doors
const H_DOOR_BOUNDARIES = [-0.2, 0.7, 0.2, -0.7]
const V_DOOR_BOUNDARIES = [-0.7, 0.2, 0.7, -0.2]

//the height that a door has to reach in the animation, and its speed
const DOOR_TARGET_Y_OPEN = 1.0
const DOOR_TARGET_Y_CLOSED = 0.0
const DOOR_OPENING_SPEED = 1.0

/**
 * A door. stores info on its number (is activated by activators with same number), if is open and how much (info useful for animation)
 * also stores the tile on which it's placed, to change its bounds when opened/closed
 * @param {*} number 
 * @param {*} isOpen 
 * @param {*} yOpen 
 * @param {*} tile 
 */
var Door = function(number, isOpen, tile) {
    this.number = number
    this.isOpen = isOpen
    this.yOpen = isOpen ? DOOR_TARGET_Y_OPEN : DOOR_TARGET_Y_CLOSED //set the y accordingly to its status
    this.tile = tile

    /**
     * Function with a delta time. rise the door if opened and has not reached yet the target height
     */
    this.update = function(delta) {
        //if it's open but not fully, go on with the rising on y
        if(isOpen && yOpen<DOOR_TARGET_Y_OPEN) {
            yOpen = Math.min(yOpen+delta*DOOR_OPENING_SPEED, DOOR_TARGET_Y_OPEN)
        } else if (!isOpen && yOpen > DOOR_TARGET_Y_CLOSED) {
            yOpen = Math.max(yOpen - delta*DOOR_OPENING_SPEED, DOOR_TARGET_Y_CLOSED)
        }
    }

    /**
     * Open the door only if the number is the same as this door
     */
    this.openIfNumber = function(activationNumber) {
        if(this.number == activationNumber)
            isOpen = true
    }

    /**
     * Close the door only if the number is the same as this door
     */
    this.closeIfNumber = function(activationNumber) {
        if(this.number == activationNumber)
            isOpen = false
    }
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