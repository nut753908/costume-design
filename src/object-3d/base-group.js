import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { loadBaseGeometry } from "../geometry/base.js";
import { createLineMaterial } from "../material/line.js";
import { createToonMaterial } from "../material/toon.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @return {?THREE.Group}
 */
export async function createBaseGroup(gui, scene) {
  const group = new THREE.Group();
  const folder = gui.addFolder("baseGroup");

  const geometry = await loadBaseGeometry();
  if (!geometry) return null;

  const lineMaterial = createLineMaterial(folder, 0);
  const toonMaterial = createToonMaterial(0xfef3ef, 0xfde2df, folder);

  group.add(new THREE.LineSegments(geometry, lineMaterial));
  group.add(new THREE.Mesh(geometry, toonMaterial));

  scene.add(group);

  return group;
}
