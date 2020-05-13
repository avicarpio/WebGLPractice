import * as THREE from './three.module.js';
import { DDSLoader } from './DDSLoader.js';
import { MTLLoader } from './MTLLoader.js';
import { OBJLoader } from './OBJLoader.js';

var renderer;
var scene;
var camera;
var positionPlayer = 0;
var score = 0;
var counter = 0;
var sphereArray = [];
var time2spawn = 90;
var globalCounter = 0;

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
  audioLoader.load( 'audio/DaftPunk.ogg', function ( buffer ) {

    sound1.setBuffer( buffer );
    sound1.setRefDistance( 100 );
    sound1.play();

  } );
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

function createSphere(pos){

  var sphereGeometry = new THREE.SphereGeometry(5, 30, 30);
  var sphereMesh = new THREE.Mesh(sphereGeometry);
  sphereMesh.name = 'point';
  sphereArray.push(sphereMesh);
  scene.add(sphereMesh);

  switch(pos){
    case -1:
      sphereMesh.position.x = -20;
      break;
    case 0:
      sphereMesh.position.x = 0;
      break;
    case 1:
      sphereMesh.position.x = 20;
      break;
  }
  sphereMesh.position.y = 10;
  sphereMesh.position.z = -1300;

}

function loadObject1(){

  var material = new THREE.MeshPhongMaterial();
  //cargar texturas...

  var loader = new OBJLoader();

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
  
    var loader = new OBJLoader();
  
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


    var onProgress = function ( xhr ) {

      if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

      }

    };

    var onError = function () { };

    var manager = new THREE.LoadingManager();
				manager.addHandler( /\.dds$/i, new DDSLoader() );

				// comment in the following line and import TGALoader if your asset uses TGA textures
				// manager.addHandler( /\.tga$/i, new TGALoader() );

				new MTLLoader( manager )
					.setPath( 'SuperAudioAssets/' )
					.load( 'spaceship.mtl', function ( materials ) {

						materials.preload();

						new OBJLoader( manager )
							.setMaterials( materials )
							.setPath( 'SuperAudioAssets/' )
							.load( 'spaceship.obj', function ( object ) {

								object.name = "player";
                scene.add(object);
                scene.getObjectByName('player').position.z = 70;
                scene.getObjectByName('player').position.y = 15;
                scene.getObjectByName('player').rotation.y = 3.14;
                scene.getObjectByName('player').scale.set(0.05,0.05,0.05);

							}, onProgress, onError );

					} );
  }
//init() gets executed once
function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x515151 );
  createRenderer();
  createCamera();
  createLight();
  createAmbient();

  loadObject1();
  loadObject2();
  loadPlayer();

  loadSong();

  createSphere(0);

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
      if(scene.getObjectByName('carril2') != null){
        scene.getObjectByName('carril2').position.z = -1550;
      }
    }
    scene.getObjectByName('carril1').position.z += 5;
  }
  if(scene.getObjectByName('carril2') != null){
    if(scene.getObjectByName('carril2').position.z == 0){
      if(scene.getObjectByName('carril1') != null){
        scene.getObjectByName('carril1').position.z = -1550;
      }
    }
    scene.getObjectByName('carril2').position.z += 5;
  }

  counter++;
  globalCounter++;

  if(globalCounter == 1300){
    time2spawn = time2spawn / 2;
  }

  if(globalCounter == 2500){
    time2spawn = time2spawn / 2;
  }

  if(counter > time2spawn){
    var spawnPos = Math.floor(Math.random() * (1 - (-1)+ 1)) + -1;
    createSphere(spawnPos);
    counter = 0;
  }

  for (var i = 0; i < sphereArray.length; i++){
    sphereArray[i].position.z += 10;
    if(sphereArray[i].position.z > 65 && sphereArray[i].position.z < 80 && scene.getObjectByName('player').position.x == sphereArray[i].position.x){
      score += 100;
      sphereArray.splice(i,1);
    }

    if(sphereArray[i].position.z > 100){
      score -= 400;
      sphereArray.splice(i,1);
    }
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

  score++;

  document.getElementById("score").textContent = "Score = " + score;

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