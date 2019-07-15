/**
 * mapElements.js contains definitions of elements/objects used in the game logic
 */

var doors = []
var levers = []
var keys = []
var keyholes = []
 //player's inventory. contains Item objects
var inventory = []


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
const DOOR_OPENING_SPEED = 0.25
const DOOR_OPEN_RATIO_PASS = 0.5 // the percentage of opening action of the door above which the player can pass through it

const LEVER_ALPHA_SPEED = 1.7

//pick speed in term of alpha of the key and y offset for final location of key (should finish under the camera for a "picked" effect)
const KEY_ALPHA_PICK_SPEED = 0.9
const KEY_PICK_Y_OFFSET = 0.12

//item univoque names
const ITEM_NAME_KEY = 'key'

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
    
    //is still means if it's not moving, to save computation if it's not
    this.isStill = true

    //node for animation in scenegraph. It's bound and used in the animation section
    this.node = undefined

    /**
     * Function with a delta time. rise the door if opened and has not reached yet the target height
     */
    this.update = function(delta) {
        if(this.isStill)
            return

        
        
        //if it's open but not fully, go on with the rising on y
        if(this.isOpen && this.yOpen < DOOR_TARGET_Y_OPEN) {
            this.yOpen = Math.min(this.yOpen + delta*DOOR_OPENING_SPEED, DOOR_TARGET_Y_OPEN)
        } else if (!this.isOpen && this.yOpen > DOOR_TARGET_Y_CLOSED) {
            this.yOpen = Math.max(this.yOpen - delta*DOOR_OPENING_SPEED, DOOR_TARGET_Y_CLOSED)
        }

        let openCompletion = (this.yOpen - DOOR_TARGET_Y_CLOSED)/(DOOR_TARGET_Y_OPEN - DOOR_TARGET_Y_CLOSED)

        document.getElementById("debugDoors").innerText = "Door " + this.number + " opened at " + ((openCompletion*100).toFixed(2)) + "%"
        
        //logically open/close the door when it reaches the right ratio
        if(this.isOpen && openCompletion >= DOOR_OPEN_RATIO_PASS) {
            this.tile.hasBounds = false
        } else if (!this.isOpen && openCompletion <= DOOR_OPEN_RATIO_PASS) {
            this.tile.hasBounds = true
        }

        //if totally opened/closed, stop moving
        if((openCompletion == 1 && this.isOpen) || (openCompletion == 0 && !this.isOpen)) {
            this.isStill = true
        }
    }

    /**
     * Open the door only if the number is the same as this door
     */
    this.openIfNumber = function(activationNumber) {
        if(this.number == activationNumber && !this.isOpen) {
            this.isOpen = true
            this.isStill = false
        }
    }

    /**
     * Close the door only if the number is the same as this door
     */
    this.closeIfNumber = function(activationNumber) {
        if(this.number == activationNumber && this.isOpen) {
            this.isOpen = false
            this.isStill = false
        }  
    }

    /**
     * Open the door
     */
    this.open = function() {
        this.isOpen = true
        this.isStill = false
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
var Lever = function(number, isActivated, x0, x1, y0, y1, z0, z1, centerPosition) {
    this.number = number
    this.isActivated = isActivated || false
    //boundaries: divided in vertical and horizontal. the horizontal define the bottom of the box which is the hitbox of the lever
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.z0 = z0
    this.z1 = z1
    //position of the center of rotation of this lever. make an average of hitbox if not provided (should be provided though)
    this.centerPosition = centerPosition || [(x1+x0)/2, (y1+y0)/2, (z1+z0)/2]
    /**
     * calculate the face direction based on the bounds and the centerPosition. As for tiles, directions are 0,1,2,3 -> north, east, south, west
     */
    this.faceDirection =    centerPosition[0] > (x1+x0)/2 ? 3 : //west
                            centerPosition[0] < (x1+x0)/2 ? 1 : //east
                            centerPosition[2] > (z1+z0)/2 ? 0 : //north
                                                            2   //south (default)

    //alpha for the rotation animation, from 0 to 1
    this.alphaRotation = this.isActivated ? 1.0 : 0.0

    //node for animation in scenegraph. It's bound and used in the animation section
    this.node = undefined

    //change the lever's status active/inactive, and activate the corresponding doors with same number (array)
    this.activate = function(doors) {
        this.isActivated = !this.isActivated
        for (let i = 0; i < doors.length; i++) {
            if(doors[i].number == this.number) {
                this.isActivated ? doors[i].openIfNumber(this.number) : doors[i].closeIfNumber(this.number)
                document.getElementById("debugLevers").innerText = "The lever activated door #" + doors[i].number + "!"
            }
        }    
    }


    this.update = function(delta) {
        //if is rotating update its alpha
        if((this.alphaRotation < 1.0 && this.isActivated) || (this.alphaRotation > 0.0 && !this.isActivated)) {
            if(this.isActivated)  //if activated and rotating, increase alpha
                this.alphaRotation = Math.min(1.0, this.alphaRotation + delta*LEVER_ALPHA_SPEED)
            else
                this.alphaRotation = Math.max(0.0, this.alphaRotation - delta*LEVER_ALPHA_SPEED)
        }
        
    }

    //check if this lever is reachable from given position and angles with a reach length
    this.isReachable = function(x, y, z, angleH, angleV, reach) {
        //check on y
        let reachY = Math.sin(utils.degToRad(angleV))*reach
        if(reachY >= 0) {
            if(y > this.y1 || (y+reachY) < this.y0)
                return false
        } else {
            if(y < this.y0 || (y+reachY) > this.y1)
                return false
        }

        //check on x
        let reachH = Math.cos(utils.degToRad(angleV))*reach
        let reachX = Math.sin(utils.degToRad(angleH))*reachH
        if(reachX >= 0) {
            if(x > this.x1 || (x+reachX) < this.x0)
                return false
        } else {
            if(x < this.x0 || (x+reachX) > this.x1)
                return false
        }

        //check on z
        let reachZ = -Math.cos(utils.degToRad(angleH))*reachH
        if(reachZ >= 0) {
            if(z > this.z1 || (z+reachZ) < this.z0)
                return false
        } else {
            if(z < this.z0 || (z+reachZ) > this.z1)
                return false
        }

        //if all check passed, then lever is reachable
        return true
    }
}

/**
 * A key with the specified number (used to activate a certain door) and coordinates
 * x0 is the minimum x coordinate, x1 the maximum. The same for others. These coordinates are used to describe its boundaries (a box)
 * @param {*} number 
 * @param {if the key has been already picked up} isPickedUp
 * @param {*} x0 
 * @param {*} x1 
 * @param {*} y0 
 * @param {*} y1 
 * @param {*} z0 
 * @param {*} z1 
 */
var Key = function(number, isPickedUp, type, x0, x1, y0, y1, z0, z1) {
    this.number = number
    this.isPickedUp = isPickedUp || false
    this.type = type
    //boundaries: divided in vertical and horizontal. the horizontal define the bottom of the box which is the hitbox of the lever
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.z0 = z0
    this.z1 = z1

    this.startX = (x1+x0)/2
    this.startY = (y1+y0)/2
    this.startZ = (z1+z0)/2

    this.x = this.startX
    this.y = this.startY
    this.z = this.startZ

    this.alphaPicked = 0.0
    this.isInAnimation = false

    //node for animation in scenegraph. It's bound and used in the animation section
    this.node = undefined

    //check if this key is reachable from given position and angles with a reach length. False if has already been picked up
    this.isReachable = function(x, y, z, angleH, angleV, reach) {
        if(this.isPickedUp)
            return false
        //check on y
        let reachY = Math.sin(utils.degToRad(angleV))*reach
        if(reachY >= 0) {
            if(y > this.y1 || (y+reachY) < this.y0)
                return false
        } else {
            if(y < this.y0 || (y+reachY) > this.y1)
                return false
        }

        //check on x
        let reachH = Math.cos(utils.degToRad(angleV))*reach
        let reachX = Math.sin(utils.degToRad(angleH))*reachH
        if(reachX >= 0) {
            if(x > this.x1 || (x+reachX) < this.x0)
                return false
        } else {
            if(x < this.x0 || (x+reachX) > this.x1)
                return false
        }

        //check on z
        let reachZ = -Math.cos(utils.degToRad(angleH))*reachH
        if(reachZ >= 0) {
            if(z > this.z1 || (z+reachZ) < this.z0)
                return false
        } else {
            if(z < this.z0 || (z+reachZ) > this.z1)
                return false
        }

        //if all check passed, then key is reachable
        return true
    }

    /**
     * Pick up the key and put the relative key item in the passed inventory
     * The key is no more pick-uppable after this
     */
    this.pickUp = function() {
        if (this.isPickedUp)
            return

        this.isPickedUp = true
        this.isInAnimation = true
        
        //push a new key item in the inventory
        inventory.push(new Item(ITEM_NAME_KEY, this.number, this.type))
        displayInventory()
    }

    /**
     * Update the key, with player positions values also
     */
    this.update = function(delta, px, py, pz) {
        if(this.isInAnimation) {
            if(this.alphaPicked == 1.0) {
                this.isInAnimation = false
                return
            }
            this.alphaPicked = Math.min(1.0, this.alphaPicked + delta*KEY_ALPHA_PICK_SPEED)
            
            if(this.alphaPicked == 1.0) { //if alpha after moving is at 1, set position under the dungeon
                this.x = this.startX
                this.y = -0.2
                this.z = this.startZ
            } else { //else compute the new x,y,z, which approach the player
                this.x = utils.middleValueAlpha(this.startX, px, this.alphaPicked)
                this.y = utils.middleValueAlpha(this.startY, py - KEY_PICK_Y_OFFSET, this.alphaPicked)
                this.z = utils.middleValueAlpha(this.startZ, pz, this.alphaPicked)
            }
        }
    }

    this.relativeX = function() {
        return this.x - this.startX
    }

    this.relativeY = function() {
        return this.y - this.startY
    }

    this.relativeZ = function() {
        return this.z - this.startZ
    }
}


/**
 * A keyhole with the specified number (used to activate a certain door) and coordinates
 * x0 is the minimum x coordinate, x1 the maximum. The same for others. These coordinates are used to describe its boundaries (a box)
 * @param {*} number 
 * @param {if the key has been already picked up} isOpened
 * @param {The type of the keyhole (copper, etc)} type
 * @param {the associated door} door
 * @param {*} x0 
 * @param {*} x1 
 * @param {*} y0 
 * @param {*} y1 
 * @param {*} z0 
 * @param {*} z1 
 */
var Keyhole = function(door, isOpened, type, x0, x1, y0, y1, z0, z1) {
    this.isOpened = isOpened || false
    this.type = type
    this.door = door
    //boundaries: divided in vertical and horizontal. the horizontal define the bottom of the box which is the hitbox of the lever
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
    this.z0 = z0
    this.z1 = z1

    //node for animation in scenegraph. It's bound and used in the animation section
    this.node = undefined

    //check if this key is reachable from given position and angles with a reach length
    this.isReachable = function(x, y, z, angleH, angleV, reach) {
        //check on y
        let reachY = Math.sin(utils.degToRad(angleV))*reach
        if(reachY >= 0) { //note that y bounds are moved accordingly to the ones of door to which it's attached
            if(y > this.y1 + this.door.yOpen || (y+reachY) < this.y0 + this.door.yOpen)
                return false
        } else {
            if(y < this.y0 + this.door.yOpen || (y+reachY) > this.y1 + this.door.yOpen)
                return false
        }

        //check on x
        let reachH = Math.cos(utils.degToRad(angleV))*reach
        let reachX = Math.sin(utils.degToRad(angleH))*reachH
        if(reachX >= 0) {
            if(x > this.x1 || (x+reachX) < this.x0)
                return false
        } else {
            if(x < this.x0 || (x+reachX) > this.x1)
                return false
        }

        //check on z
        let reachZ = -Math.cos(utils.degToRad(angleH))*reachH
        if(reachZ >= 0) {
            if(z > this.z1 || (z+reachZ) < this.z0)
                return false
        } else {
            if(z < this.z0 || (z+reachZ) > this.z1)
                return false
        }

        //if all check passed, then key is reachable
        return true
    }

    /**
     * Open up the key and put the relative key item in the passed inventory
     * The keyhole is no more openable after this
     */
    this.openUp = function() {
        if (this.isOpened)
            return
        //if the key is in the inventory, remove it and open the keyhole. otherwise do nothing
        for (let i = 0; i < inventory.length; i++) {
            if(inventory[i].name == ITEM_NAME_KEY && inventory[i].value == this.door.number) {
                this.isOpened = true
                this.door.open()
                inventory.splice(i, 1) //remove the key from inventory
                displayInventory()
            }
        }

    }
}


/**
 * A item held by the player
 * @param {Item's name} name 
 * @param {Item's value, useful for some type of item} value 
 */
var Item = function(name, value, type) {
    this.name = name
    this.value = value
    this.type = type

    this.itemString = function itemString() {
        return "("+this.type+" "+this.name+")"
    }
}


/**
 * Display the inventory in a string in the dedicated div in html
 */
function displayInventory() {
    let invString = "Inventory: ["
    for (let i = 0; i < inventory.length; i++) {
        invString += inventory[i].itemString()
        if(i != inventory.length-1)
            invString += ", "
    }
    invString += "]"
    document.getElementById("inventory").innerText = invString
}