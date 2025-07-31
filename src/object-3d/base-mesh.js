import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createLineMaterial } from "../material/line.js";
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

  const group = new THREE.Group();
  const folder = gui.addFolder("baseMesh");

  const geometry = gltf.scene.children[0].geometry;

  const lineMaterial = createLineMaterial(folder);
  const toonMaterial = createToonMaterial(0xfef3ef, 0xfde2df, folder);

  group.add(new THREE.LineSegments(geometry, lineMaterial));
  group.add(new THREE.Mesh(geometry, toonMaterial));

  scene.add(group);

  return group;
}
