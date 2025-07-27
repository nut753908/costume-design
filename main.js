import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let renderer, camera, controls, scene;
let cube;

const frustumSize = 8;

init();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    -(frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );
  camera.position.z = 5;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const gui = new GUI();

  scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);
  {
    const folder = gui.addFolder("THREE.AxesHelper");
    folder.add(axesHelper, "visible");
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -(frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
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
