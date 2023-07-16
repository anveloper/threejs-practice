import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

window.addEventListener("load", function () {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.y = 10;
  camera.position.z = 40;

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75;
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;

  const loader = new GLTFLoader();
  loader.load("assets/mugy.gltf", ({ scene }) => {
    const surfaceMesh = scene.children[0].children[0].children[1] as THREE.Mesh;
    if (surfaceMesh) {
      setTimeout(() => {
        const tloader = new THREE.TextureLoader();
        tloader.load("assets/logo.png", (t) => {
          t.flipY = false;
          surfaceMesh.material = new THREE.MeshBasicMaterial({
            map: t,
          });
        });
      }, 3000);
    }
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

    ambientLight.position.set(-5, -5, -5);

    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
    const directionalLight2 = directionalLight1.clone();

    directionalLight1.position.set(1, 1, 3);
    directionalLight2.position.set(-1, 1, -3);

    scene.add(directionalLight1, directionalLight2);

    render();
    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }
    window.addEventListener("resize", handleResize);

    const replaceSurface = (e: any) => {
      const url = e.target.value;
      const tloader = new THREE.TextureLoader();
      tloader.load(url, (t) => {
        t.flipY = false;
        surfaceMesh.material = new THREE.MeshBasicMaterial({
          map: t,
        });
      });
    };
    document.getElementById("url")?.addEventListener("change", replaceSurface);
  });
}
