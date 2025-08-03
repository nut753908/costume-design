import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createControlPointGeometry } from "../../geometry/control-point.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @return {THREE.Group}
 */
export function createControlPointGroup(gui, scene) {
  const group = new THREE.Group();
  const folder = gui.addFolder("controlPointGroup");

  const geometry = createControlPointGeometry(folder);

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  group.add(new THREE.Line(geometry, lineMaterial));
  group.add(new THREE.Points(geometry, pointsMaterial));

  scene.add(group);

  return group;
}
