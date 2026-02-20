import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 3);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
document.getElementById("viewer").appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LOAD MATERIALS
const mtlLoader = new MTLLoader();
mtlLoader.setPath("3d-assets/");
mtlLoader.load("Jewel_CD.mtl", (materials) => {
  materials.preload();

  // LOAD OBJ
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("3d-assets/");
  objLoader.load("Jewel_CD.obj", (object) => {
    object.scale.set(1, 1, 1);
    object.position.y = -0.5;
    scene.add(object);
  });
});

// RESIZE FIX
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
