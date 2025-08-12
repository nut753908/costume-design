import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { LimitedTube } from "../../curve/limited-tube.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createToonMaterial } from "../../material/toon.js";

/**
 * @param {GUI} gui
 * @param {LimitedTube} lt
 * @param {THREE.Scene} scene
 * @return {THREE.Group}
 */
export function createLimitedTubeGroup(gui, lt, scene) {
  const group = new THREE.Group();
  const folder = gui.addFolder("limitedTubeGroup");

  const emptyGeometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder);
  const toonMaterial = createToonMaterial(
    0xfcd7e9,
    0xf8c1de,
    folder,
    THREE.DoubleSide
  );

  group.add(new THREE.LineSegments(emptyGeometry, lineMaterial));
  group.add(new THREE.Mesh(emptyGeometry, toonMaterial));

  lt.createGeometry(group);
  lt.setGUI(folder);

  scene.add(group);

  return group;
}
