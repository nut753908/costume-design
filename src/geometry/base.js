import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * @return {THREE.BufferGeometry}
 */
export async function loadBaseGeometry() {
  const loader = new GLTFLoader();
  const gltf = await loader
    .loadAsync("../../models/base1-22.glb")
    .catch((error) => console.error(error));
  if (!gltf) return null;

  return gltf.scene.children[0].geometry;
}
