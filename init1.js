import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

const frustumSize = 2;

/**
 * @param {()=>void} animate
 * @return {THREE.WebGLRenderer}
 */
export function createRenderer(animate) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

/**
 * @return {THREE.OrthographicCamera}
 */
export function createCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    -(frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
}

/**
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @return {{controls: OrbitControls, gizmo: ViewportGizmo}}
 */
export function createControlsAndGizmo(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  const gizmo = new ViewportGizmo(camera, renderer, { offset: { right: 280 } });
  gizmo.attachControls(controls);

  return { controls, gizmo };
}

/**
 * @param {THREE.Camera} camera
 */
export function updateCamera(camera) {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -(frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.updateProjectionMatrix();
}

/**
 * @param {THREE.WebGLRenderer} renderer
 */
export function updateRenderer(renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
}
