//example taken from webGLTutorial2
var Node = function() {
    this.children = [];
    this.localMatrix = utils.identityMatrix();
    this.worldMatrix = utils.identityMatrix();
    //to improve performance, if a node is not active nothing will be computed when updating matrices
    this.isActive = false
  };
  
  Node.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
      var ndx = this.parent.children.indexOf(this);
      if (ndx >= 0) {
        this.parent.children.splice(ndx, 1);
      }
    }
  
    // Add us to our new parent
    if (parent) {
      parent.children.push(this);
    }
    this.parent = parent;
  };
  
  //update its world matrix and its children's, if is an active node
  Node.prototype.updateWorldMatrix = function(matrix) {
    if(!this.isActive) {
      return
    }
    if (matrix) {
      // a matrix was passed in so do the math
      this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
    } else {
      // no matrix was passed in so just copy.
      utils.copy(this.localMatrix, this.worldMatrix);
    }
  
    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMatrix);
    });
  };

  var rootNode = new Node()
  rootNode.isActive = true

  var nodes = new Array()

  function loadSceneGraphFromModel(loadedModel) {
    //temp arrays used to bind keyholes to their doors, after having loaded all nodes
    let doorNodes = []
    let keyholeNodesToBind = []
    let keyholeNodesToBindNum = []

    for (let i = 0; i < sceneObjects; i++) {
      let oname = loadedModel.rootnode.children[i].name.toLowerCase()

      let node = new Node()
      nodes[i] = node
      node.localMatrix = loadedModel.rootnode.children[i].transformation
      
      //if it's a keyhole
      if(oname.startsWith('keyhole')) {
        node.isActive = true
        //find the number and type from the name
        let khNum = parseInt(oname.split('-')[0].substring(7))
        //push the new keyhole in the array of keyholes and in the one used to bind later to it its door, because it could not be in the doors array yet
        keyholeNodesToBind.push(node)
        keyholeNodesToBindNum.push(khNum)
        //bind this node to its logical object
        bindNodeToKeyhole(khNum, node)
      }
      //if it's a key or lever or a fire, set active to true, since these could be animated, and set their parent to root
      else if(oname.startsWith('key')) {
        node.isActive = true
        node.setParent(rootNode)
        let keyNum = parseInt(oname.split('-')[0].substring(3))
        //bind this node to its logical object
        bindNodeToKey(keyNum, node)
      }

      else if(oname.startsWith('fire')) {
        node.isActive = true
        node.setParent(rootNode)
        let fireNum = parseInt(oname.split('_')[0].substring(5))
        //bind this node to its logical object
        bindNodeToFire(fireNum, node)
      }

      else if(oname.startsWith('lever')) {
        node.isActive = true
        node.setParent(rootNode)
        let leverNum = parseInt(oname.split('_')[0].substring(5))
        //bind this node to its logical object
        bindNodeToLever(leverNum, node)
      }
      //if it's a door (exclude the doors_cube object)
      else if(oname.startsWith('door') && !oname.startsWith('doors')) {
        node.isActive = true
        node.setParent(rootNode)
        let doorNum = parseInt(oname.split('_')[0].substring(4))
        doorNodes[doorNum] = node
        //bind this node to its logical object
        bindNodeToDoor(doorNum, node)
      } else { //for every other element, set the root node as parent
        node.setParent(rootNode)
      }
    }

    //after the loop, bind all keyhole nodes to their doors
    for (let i = 0; i < keyholeNodesToBind.length; i++) {
      keyholeNodesToBind[i].setParent(doorNodes[keyholeNodesToBindNum[i]])
    }

  }

  function updateSceneGraph() {
    rootNode.updateWorldMatrix()
  }