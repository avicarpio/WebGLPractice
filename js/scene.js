var renderer;
var scene;
var camera;

function createRenderer(){

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

}

function createCamera(){

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;
  camera.lookAt(scene.position);
  cameraControl = new THREE.OrbitControls(camera);

}

function createBox(){
  var boxGeometry = new THREE.BoxGeometry(6, 4, 6);
  var boxMaterial = new THREE.MeshLambertMaterial({
    color: "red"
  });
  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  scene.add(box);
}

function createPlane(){
  var planeGeometry = new THREE.PlaneGeometry(20,20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -2;
  scene.add(plane);
}

function createLight(){
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10,20,20);
  spotLight.shadow.camera.near = 20;
  spotLight.shadow.camera.far = 50;
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function loadObject(){

  var material = new THREE.MeshPhongMaterial();
  //cargar texturas...

  var loader = new THREE.OBJLoader();

  loader.load('lee/lee.obj', function (object){
    object.traverse(function(child){
      if(child instanceof THREE.Mesh){
        child.material = material;
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    object.name = "model";
    scene.add(object);

  });
}

//init() gets executed once
function init(){
  scene = new THREE.Scene();
  createRenderer();
  createCamera();
  createLight();

  loadObject();

  //add renderer to HTML DOM
  document.body.appendChild(renderer.domElement);

  render();
}


//render Loop
function render(){
  //render contents of Scene
  renderer.render(scene, camera);

  if(moveLeft){
    scene.getObjectByName('model').position.x += 1;
  }

  if(moveRight){
    scene.getObjectByName('model').position.x -= 1;
  }

  //tell browser to execute function renderer
  //when its ready to repaint
  requestAnimationFrame(render);
}

init();

var moveLeft = false;
var moveRight = false;

window.addEventListener("keydown", function(e){
  switch(e.key){
    case 'a':
        moveLeft = true;
        break;
    case 'd':
        moveRight = true;
        break;

  }
});


window.addEventListener("keyup", function(e){
  switch(e.key){
    case 'a':
        moveLeft = false;
        break;
    case 'd':
        moveRight = false;
        break;

  }
});

document.getElementById("test").addEventListener("mousedown", function(e){
  scene.getObjectByName('model').position.y += 1;
});
