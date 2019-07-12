var canvas = document.querySelector('canvas')

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
 
 canvas.onclick = function() {
   canvas.requestPointerLock();
 };

 // pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);


function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", updatePosition, false);
      document.addEventListener("wheel", scrollWheel, false);
    } else {
      console.log('The pointer lock status is now unlocked'); 
      turnOffInputs()
      document.removeEventListener("mousemove", updatePosition, false);
      document.removeEventListener("wheel", scrollWheel, false);
    }
  }

  function updatePosition(e) {
        incrementPlayerVisual(e.movementX, e.movementY)
  }

  function scrollWheel(e) {
      incrementConeOut(e.deltaY)
  }