import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * @return {THREE.BufferGeometry}
 */
export async function loadBaseGeometry() {
  let loader = new GLTFLoader();
  const gltf = await loader
    .loadAsync("../../models/base1-22.glb")
    .catch((error) => console.error(error));
  if (!gltf) return null;

  loader = new THREE.FileLoader();
  const json = await loader
    .setResponseType("json")
    .loadAsync("../../models/base1-22-n-polygon-indices.txt")
    .catch((error) => console.error(error));
  if (!json) return null;

  const geometry = gltf.scene.children[0].geometry;
  geometry.nPolygonIndices = json;
  return geometry;
}
