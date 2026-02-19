// ===== IMPORT MODULES =====
import { Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight, DirectionalLight, Box3, Vector3, SRGBColorSpace } from 'https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/loaders/OBJLoader.js';

// ===== SCENE =====
const scene = new Scene();
scene.background = new Color(0x111111);

// ===== CAMERA =====
const camera = new PerspectiveCamera(45, 800 / 500, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// ===== RENDERER =====
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(800, 500);
renderer.outputColorSpace = SRGBColorSpace;
document.getElementById("viewer").appendChild(renderer.domElement);

// ===== LIGHTS =====
scene.add(new AmbientLight(0xffffff, 0.6));
const dirLight = new DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// ===== CONTROLS =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== LOAD MTL → OBJ =====
const mtlLoader = new MTLLoader();
mtlLoader.setPath("3d-assets/");

mtlLoader.load("Jewel_CD.mtl", (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("3d-assets/");

  objLoader.load(
    "Jewel_CD.obj",
    (object) => {
      // --- AUTO CENTER + SCALE ---
      const box = new Box3().setFromObject(object);
      const size = new Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDim;
      object.scale.setScalar(scale);

      box.setFromObject(object);
      const center = new Vector3();
      box.getCenter(center);
      object.position.sub(center);

      scene.add(object);
    },
    undefined,
    (error) => {
      console.error("OBJ load error:", error);
    }
  );
});

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
