import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Points } from "../../math/points.js";
import { createPointsGeometry } from "../../geometry/points.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {Points} p
 * @return {THREE.Group}
 */
export function createControlPointGroup(gui, scene, p) {
  const group = new THREE.Group();
  const folder = gui.addFolder("controlPointGroup");

  const geometry = createPointsGeometry(folder, p);

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  group.add(new THREE.Line(geometry, lineMaterial));
  group.add(new THREE.Points(geometry, pointsMaterial));

  scene.add(group);

  return group;
}
