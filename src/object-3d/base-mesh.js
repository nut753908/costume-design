import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createToonMaterial } from "../material/toon.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @return {?THREE.Mesh}
 */
export async function createBaseMesh(gui, scene) {
  const loader = new GLTFLoader();
  const gltf = await loader
    .loadAsync("../../models/base1-22.glb")
    .catch((error) => console.error(error));
  if (!gltf) return null;

  const baseMesh = gltf.scene.children[0];
  const folder = gui.addFolder("baseMesh");

  const material = createToonMaterial(0xfef3ef, 0xfde2df, folder);

  baseMesh.material = material;

  scene.add(baseMesh);

  return baseMesh;
}
