//Query user and text elements
const cameraEl = document.querySelector("[networked-avatar]"); //query the user
//const cameraEl = document.querySelector("[camera]");
//const posTextEl = document.querySelector("#pos-text");
//const angleTextEl = document.querySelector("#angle-text");
//const quadTextEl = document.querySelector("#quad-text");

const ORIGIN_X = 0;
const ORIGIN_Z = 0;

let currQuad = null;
let prevQuad = null;

assignQuadsToEntities();

//document.addEventListener('DOMContentLoaded', () => 
  function assignQuadsToEntities(){
      //Query all entity assets
      let allEntityArray = document.querySelectorAll("[gltf-model-plus][networked]");
      //const allEntityArray = document.querySelectorAll(".entity");
      allEntityArray.forEach(element => element.setAttribute("visible", false));

      //Calculate and assign corresponding "quad" class to each entity 
      for(let i = 0; i < allEntityArray.length; i++){
        let currEntity = allEntityArray[i];
        let entityPos = currEntity.getAttribute('position');
        let entityAngle = calcAngle(ORIGIN_X, ORIGIN_Z, entityPos.x, entityPos.z);  
        let entityQuad = calcQuad(entityAngle);

        if( entityQuad === 1 ){
          currEntity.classList.add("quad1");
        }
        else if( entityQuad === 2){
          currEntity.classList.add("quad2");
        }
        else if( entityQuad === 3){
          currEntity.classList.add("quad3");
        }
        else if( entityQuad === 4){
          currEntity.classList.add("quad4");
        }
        else{
          alert("Could not determine quadrant");
        }
      }
  }
//, false);

//Continously update scene info
setInterval(function() {
  let localPos = cameraEl.object3D.position;
  let worldPos = cameraEl.object3D.getWorldPosition();
  
  let playerX = worldPos.x;
  let playerZ = worldPos.z
  
  //Calculate user current angle and quadrant
  let currAngle = calcAngle(ORIGIN_X, ORIGIN_Z, playerX, playerZ).toFixed(2);
  currQuad = calcQuad(currAngle);
  
  // //Update user position text
  // posTextEl.setAttribute("value", "Position: " + worldPos.x.toFixed(2) + " " + worldPos.y.toFixed(2) + " " + worldPos.z.toFixed(2) + " ");
 
  // //Update user angle text
  // angleTextEl.setAttribute("value", "\n\nAngle: " + currAngle);
  
  // //Update user quadrant text
  // quadTextEl.setAttribute("value", "\n\n\n\nQuadrant: " + currQuad);
  
  //Check if user left the quadrant
  if(prevQuad != currQuad){
    //Update visible assets
    updateVisible(currQuad, prevQuad); 
    prevQuad = currQuad;
  }   
}, 1000/80);

//Calculate user's angle respective to origin
function calcAngle(x1, z1, x2, z2) {
    var result = Math.atan2(z1 - z2, x2 - x1) * (180 / Math.PI);
    return result > 0 ? result : 360 + result;
};

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
  




