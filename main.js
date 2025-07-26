import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera, controls, scene, renderer;
let cube;

init();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
