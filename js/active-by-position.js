//Query user and text elements
//const sceneEl = document.querySelector('a-scene');
const cameraEl = document.querySelector("[networked-avatar]"); //query the user
let interactablesBefore = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]").length;

//Text entities
const posTextEl = document.querySelector("#pos-text");
const angleTextEl = document.querySelector("#angle-text");
const quadTextEl = document.querySelector("#quad-text");
const strataTextEl = document.querySelector("#strata-text");

//Music entities
let strataMusicEntities = document.querySelectorAll("[sound]");
console.log("strataMusicEntities.length: " + strataMusicEntities.length);

//Query all entity assets
let allEntityArray = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]");

const ORIGIN_X = 0;
const ORIGIN_Z = 0;

let userCurrQuad = null;
let userPrevQuad = null;

let userCurrStrata = 0;
let userPrevStrata = 0;

//Start scene
// strataMusicEntities[0].components.sound.playSound();
determineUserQuad();
assignQuadsToEntities(allEntityArray);

//Continously update scene info
setInterval(function() {
  //Get update on user position and current quadrant
  determineUserQuad();

  //let interactablesAfter = document.querySelectorAll(".interactable").length;
  let interactablesAfter = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]").length;
  if (interactablesAfter != interactablesBefore){
    interactablesBefore = interactablesAfter;
    allEntityArray = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]");
    assignQuadsToEntities(allEntityArray);
  }
  
  //Check if user left the quadrant
  if(userPrevQuad != userCurrQuad){
    //Update visible assets
    updateVisible(userCurrQuad, userPrevQuad); 
    userPrevQuad = userCurrQuad;
  }   
  
  //Check if user left the strata
  if(userPrevStrata != userCurrStrata){
    //Update background sound
    updateActiveMusic(userCurrStrata, userPrevStrata);
    userPrevStrata = userCurrStrata;
  }
}, 1000/80);

function assignQuadsToEntities(entityArr){
  //entityArr.forEach(element => element.setAttribute("visible", false));

  //Calculate and assign corresponding "quad" class to each entity 
  for(let i = 0; i < entityArr.length; i++){
    let currEntity = entityArr[i];
    let entityPos = currEntity.getAttribute('position');
    let entityAngle = calcAngle(ORIGIN_X, ORIGIN_Z, entityPos.x, entityPos.z);  
    let entityQuad = calcQuad(entityAngle);

    if( entityQuad === 1 ){
      currEntity.classList.add("quad1");
      if(userCurrQuad != 1){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 2){
      currEntity.classList.add("quad2");
      if(userCurrQuad != 2){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 3){
      currEntity.classList.add("quad3");
      if(userCurrQuad != 3){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 4){
      currEntity.classList.add("quad4");
      if(userCurrQuad != 4){
        currEntity.setAttribute("visible", false)
      }
    }
    else{
      console.log("Could not determine quadrant");
    }

  }
}

function determineUserQuad(){
  //let localPos = cameraEl.object3D.position;
  let playerPos = cameraEl.object3D.getWorldPosition();
 
  //Calculate user current angle and quadrant
  let currAngle = calcAngle(ORIGIN_X, ORIGIN_Z, playerPos.x, playerPos.z).toFixed(2);
  userCurrQuad = calcQuad(currAngle);

  //Calculate user current strata
  userCurrStrata = calcStrata(playerPos.y);

  if(posTextEl && angleTextEl && quadTextEl && strataTextEl){
    updateHUDText(playerPos, currAngle, userCurrQuad, userCurrStrata);
  }
}

function updateHUDText(playerPos, currAngle, userCurrQuad, userStrata){
  //Update user position text
  posTextEl.setAttribute("value", "Position: " + playerPos.x.toFixed(2) + " " + playerPos.y.toFixed(2) + " " + playerPos.z.toFixed(2) + " "); 
  //Update user angle text
  angleTextEl.setAttribute("value", "\n\nAngle: " + currAngle); 
  //Update user quadrant text
  quadTextEl.setAttribute("value", "\n\n\n\nQuadrant: " + userCurrQuad);
  //Update user strata text
  strataTextEl.setAttribute("value", "\n\n\n\n\n\nStrata: " + userStrata);
}

//Calculate user's angle respective to origin
function calcAngle(x1, z1, x2, z2) {
    var result = Math.atan2(z1 - z2, x2 - x1) * (180 / Math.PI);
    return result > 0 ? result : 360 + result;
}

//Calculate the visited strata
function calcStrata(userHeight){
  let resultStrata = null;

  if(userHeight > 0 && userHeight <= 5.0){
    resultStrata = 0;
  }
  else if(userHeight > 5.0 && userHeight <= 10.0){
    resultStrata = 1;
  }
  else if(userHeight > 10.0 && userHeight <= 15.0){
    resultStrata = 2;
  }
  else if(userHeight > 15.0 && userHeight <= 20.0){
    resultStrata = 3;
  }
  else{
    resultStrata = null;
  }  
  return resultStrata;
}

//Calculate the visited quadrant
function calcQuad(userAngle){
  let resultQuad = null;
  
  if(userAngle > 0 && userAngle <= 90){
    resultQuad = 1;
  }
  else if(userAngle > 90 && userAngle <= 180){
    resultQuad = 2;
  }
  else if(userAngle > 180 && userAngle <= 270){
    resultQuad = 3;
  }
  else if(userAngle > 270 && userAngle <= 360){
    resultQuad = 4;
  }
  else{
    resultQuad = null;
  }  
  return resultQuad;
}

//Activate assets in current quadrant and deactivate those in previous quad
function updateVisible(quadCurr, quadPrev){

    let quadCurrArray = document.querySelectorAll(`.quad${quadCurr}`);
    let quadPrevArray = document.querySelectorAll(`.quad${quadPrev}`);

    quadCurrArray.forEach(element => element.setAttribute("visible", true));
    quadPrevArray.forEach(element => element.setAttribute("visible", false));
  
}
  
//Activate media in current strata and deactivate those in previous strata
function updateActiveMusic(strataCurr, strataPrev){
  console.log("Current Strata: " + strataCurr);
  console.log("Previous Strata: " + strataPrev);
  
  if(strataPrev != null){
    strataMusicEntities[strataPrev].components.sound.stopSound();
  }
  if(strataCurr != null){
    strataMusicEntities[strataCurr].components.sound.playSound();
  }
}




