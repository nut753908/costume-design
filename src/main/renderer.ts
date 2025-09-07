import * as THREE from "three";

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
 * @param {THREE.WebGLRenderer} renderer
 */
export function updateRenderer(renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
}
