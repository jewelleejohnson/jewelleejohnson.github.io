// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(45, 600 / 400, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(600, 400);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("viewer").appendChild(renderer.domElement);

// ===== LIGHTS =====
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// ===== CONTROLS =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== LOAD MTL → OBJ =====
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath("3d-assets/");

mtlLoader.load("Jewel_CD.mtl", (materials) => {
  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("3d-assets/");

  objLoader.load(
    "Jewel_CD.obj",
    (object) => {
      // --- AUTO CENTER + SCALE ---
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDim; // scale to fit viewer
      object.scale.setScalar(scale);

      // Recompute bounding box after scaling
      box.setFromObject(object);
      const center = new THREE.Vector3();
      box.getCenter(center);
      object.position.sub(center); // center model

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
