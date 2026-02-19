// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  600 / 400,
  0.1,
  1000
);
camera.position.set(0, 1, 3);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(600, 400);
document.getElementById("viewer").appendChild(renderer.domElement);

// LIGHTS
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// LOAD OBJ
const loader = new THREE.OBJLoader();
loader.load(
  "3d-assets/Jewel_CD.obj",
  function (object) {
    scene.add(object);
  },
  undefined,
  function (error) {
    console.error("OBJ failed to load", error);
  }
);

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
