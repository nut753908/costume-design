import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createEmptyGeometry } from "../geometry/empty.js";
import { createLineMaterial } from "../material/line.js";
import { createToonMaterial } from "../material/toon.js";
import { createHairBundleGeometry } from "../geometry/hair-bundle.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @return {THREE.Group}
 */
export function createHairBundleGroup(gui, scene) {
  const group = new THREE.Group();
  const folder = gui.addFolder("hairBundleGroup");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder);
  const toonMaterial = createToonMaterial(
    0xfcd7e9,
    0xf8c1de,
    folder,
    THREE.DoubleSide
  );

  group.add(new THREE.LineSegments(geometry, lineMaterial));
  group.add(new THREE.Mesh(geometry, toonMaterial));

  createHairBundleGeometry(group, folder);

  scene.add(group);

  return group;
}
