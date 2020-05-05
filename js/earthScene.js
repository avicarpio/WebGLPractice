var renderer;
var scene;
var camera;

function createRenderer(){

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

}

function createEnv(){
  var envGeometry = new THREE.SphereGeometry(90,32,32);

  var envMaterial = new THREE.MeshBasicMaterial();
  envMaterial.map = THREE.ImageUtils.loadTexture('assets/galaxy_starfield.png');
  envMaterial.side = THREE.BackSide;
  var envMesh = new THREE.Mesh(envGeometry, envMaterial);
  envMesh.name = 'skybox';

  scene.add(envMesh)

}

function createCamera(){

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  camera.position.x = 90;
  camera.position.y = 32;
  camera.position.z = 32;
  camera.lookAt(scene.position);
  cameraControl = new THREE.OrbitControls(camera);

}

function createLight(){
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 10, -50);
  directionalLight.name = 'directional';
  scene.add(directionalLight);

}

function createAmbient(){

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

}

function createEarth(){
  var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
  var sphereMaterial = createEarthMaterial();
  var earthMesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
  earthMesh.name = 'earth';
  scene.add(earthMesh);
}

function createEarthMaterial(){
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/earthmap2k.jpg', function(image){
    earthTexture.image = image;
    earthTexture.needsUpdate = true;
  });

  var normalMap = new THREE.Texture();
  var loaderNormal = new THREE.ImageLoader();
  loaderNormal.load('assets/earth_normalmap_flat2k.jpg', function(image){
    normalMap.image = image;
    normalMap.needsUpdate = true;
  });

  var specularMap = new THREE.Texture();
  var loaderSpecular = new THREE.ImageLoader();
  loaderSpecular.load('assets/earthspec2k.jpg', function(image){
    specularMap.image = image;
    specularMap.needsUpdate = true;
  });

  var earthMaterial = new THREE.MeshPhongMaterial();

  earthMaterial.normalMap = normalMap;
  earthMaterial.normalScale = new THREE.Vector2(1.0,1.0);

  earthMaterial.specularMap = normalMap;
  earthMaterial.specular = new THREE.Color(0x262626);

  earthMaterial.map = earthTexture;

  return earthMaterial;
}

function createClouds(){
  var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
  var sphereMaterial = createCloudsMaterial();
  sphereGeometry.scale(1.01,1.01,1.01);
  var clourdsMesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
  clourdsMesh.name = 'clouds';
  scene.add(clourdsMesh);
}

function createCloudsMaterial(){
  var cloudsTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/fair_clouds_1k.png', function(image){
    cloudsTexture.image = image;
    cloudsTexture.needsUpdate = true;
  });

  var cloudsMaterial = new THREE.MeshPhongMaterial();
  cloudsMaterial.map = cloudsTexture;
  cloudsMaterial.transparent = true;

  return cloudsMaterial;
}

//init() gets executed once
function init(){
  scene = new THREE.Scene();

  createRenderer();
  createCamera();
  createLight();
  createAmbient();
  createEarth();
  createClouds();
  createEnv();

  //add renderer to HTML DOM
  document.body.appendChild(renderer.domElement);

  render();
}


//render Loop
function render(){
  //render contents of Scene
  renderer.render(scene, camera);

  cameraControl.update();

  scene.getObjectByName('earth').rotation.y += 0.005;
  scene.getObjectByName('clouds').rotation.y += 0.003;

  //tell browser to execute function renderer
  //when its ready to repaint
  requestAnimationFrame(render);
}

init();
