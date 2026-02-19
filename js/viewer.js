import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';

// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / (window.innerHeight * 0.7),
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("viewer").appendChild(renderer.domElement);

// ===== LIGHTS =====
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// ===== CONTROLS =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== LOAD MTL → OBJ =====
const mtlLoader = new MTLLoader();
mtlLoader.setPath("./3d-assets/");

let model = null;

mtlLoader.load("Jewel_CD.mtl", (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("./3d-assets/");

  objLoader.load(
    "Jewel_CD.obj",
    (object) => {
      // Auto scale and center
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDim;
      object.scale.setScalar(scale);

      box.setFromObject(object);
      const center = new THREE.Vector3();
      box.getCenter(center);
      object.position.sub(center);

      scene.add(object);
      model = object;
    },
    undefined,
    (error) => console.error("OBJ load error:", error)
  );
});

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Optional slow rotation
  if (model) model.rotation.y += 0.005;

  renderer.render(scene, camera);
}

animate();

// ===== HANDLE RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
});
