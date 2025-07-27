import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let renderer, camera, controls, gizmo, scene;
let lightHelper, cube;

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

  gizmo = new ViewportGizmo(camera, renderer, { offset: { right: 280 } });
  gizmo.attachControls(controls);

  //

  const gui = new GUI();

  scene = new THREE.Scene();

  {
    const helper = new THREE.AxesHelper(3);
    scene.add(helper);
    const folder = gui.addFolder("THREE.AxesHelper");
    folder.add(helper, "visible");
  }

  let light;
  {
    light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);
    const folder = gui.addFolder("THREE.DirectionalLight");
    const posFolder = folder.addFolder("position");
    posFolder.add(light.position, "x", -10, 10, 1);
    posFolder.add(light.position, "y", -10, 10, 1);
    posFolder.add(light.position, "z", -10, 10, 1);
  }

  {
    lightHelper = new THREE.DirectionalLightHelper(light, 1);
    scene.add(lightHelper);
    const folder = gui.addFolder("THREE.DirectionalLightHelper");
    folder.add(lightHelper, "visible");
  }

  {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshToonMaterial({ color: 0x44aa88 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }

  //

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

  gizmo.update();
}

function animate() {
  lightHelper.update();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  gizmo.render();
}
