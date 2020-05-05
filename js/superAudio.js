var renderer;
var scene;
var camera;
var positionPlayer = 0;

function createRenderer(){

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

}

function createCamera(){

  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  camera.position.x = 0;
  camera.position.y = 86;
  camera.position.z = 80;
  camera.lookAt(scene.position);

}

function loadSong(){
  // create an AudioListener and add it to the camera
  var listener = new THREE.AudioListener();
  camera.add( listener );

  var audioLoader = new THREE.AudioLoader();

  var sound1 = new THREE.PositionalAudio( listener );
  audioLoader.load( 'audio/sandstorm.ogg', function ( buffer ) {

    sound1.setBuffer( buffer );
    sound1.setRefDistance( 100 );
    sound1.play();

  } );
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
  spotLight.position.set(0,100,100);
  spotLight.shadow.camera.near = 20;
  spotLight.shadow.camera.far = 50;
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function createAmbient(){

  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

}

function loadObject1(){

  var material = new THREE.MeshPhongMaterial();
  //cargar texturas...

  var loader = new THREE.OBJLoader();

  loader.load('SuperAudioAssets/Carril.obj', function (object){
    object.traverse(function(child){
      if(child instanceof THREE.Mesh){
        child.material = material;
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    object.name = "carril1";
    scene.add(object);

  });
}

function loadObject2(){

    var material = new THREE.MeshPhongMaterial();
    //cargar texturas...
  
    var loader = new THREE.OBJLoader();
  
    loader.load('SuperAudioAssets/Carril.obj', function (object){
      object.traverse(function(child){
        if(child instanceof THREE.Mesh){
          child.material = material;
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      object.name = "carril2";
      scene.add(object);
  
      scene.getObjectByName('carril2').position.z = -1550;

    });
  }

  function loadPlayer(){

    var material = new THREE.MeshPhongMaterial();

    var loader = new THREE.OBJLoader();
  
    loader.load('SuperAudioAssets/spaceship.obj', function (object){
      object.traverse(function(child){
        if(child instanceof THREE.Mesh){
          child.material = material;
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      object.name = "player";
      scene.add(object);
      scene.getObjectByName('player').position.z = 60;
      scene.getObjectByName('player').position.y = 15;
      scene.getObjectByName('player').rotation.y = 3.14;
      scene.getObjectByName('player').scale.set(0.05,0.05,0.05);
    });
  }
//init() gets executed once
function init(){
  scene = new THREE.Scene();
  createRenderer();
  createCamera();
  createLight();
  createAmbient();

  loadObject1();
  loadObject2();
  loadPlayer();

  loadSong();

  positionPlayer = 0;
  //add renderer to HTML DOM
  document.body.appendChild(renderer.domElement);

  render();
}


//render Loop
function render(){
  //render contents of Scene
  renderer.render(scene, camera);

  if(scene.getObjectByName('carril1') != null){
    if(scene.getObjectByName('carril1').position.z == 0){
      scene.getObjectByName('carril2').position.z = -1550;
    }
    scene.getObjectByName('carril1').position.z += 5;
  }
  if(scene.getObjectByName('carril2') != null){
    if(scene.getObjectByName('carril2').position.z == 0){
      scene.getObjectByName('carril1').position.z = -1550;
    }
    scene.getObjectByName('carril2').position.z += 5;
  }

  if(moveLeft){
    if(positionPlayer > -1){
      scene.getObjectByName('player').position.x -= 20;
      positionPlayer--;
    }    
    moveLeft = false;
  }

  if(moveRight){
    if(positionPlayer < 1){
      scene.getObjectByName('player').position.x += 20;
      positionPlayer++;
    }
    moveRight = false;
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
    case 37:
      moveLeft = true;
      break;
    case 39:
      moveRight = true;
      break;
  }
});