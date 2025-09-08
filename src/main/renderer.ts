import * as THREE from "three";

export function createRenderer(
  animate: XRFrameRequestCallback | null,
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export function updateRenderer(renderer: THREE.WebGLRenderer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
}
