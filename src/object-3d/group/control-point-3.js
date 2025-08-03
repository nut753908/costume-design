import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint3 } from "../../math/control-point-3.js";
import { createControlPoint3Geometry } from "../../geometry/control-point-3.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {ControlPoint3} cp
 * @return {THREE.Group}
 */
export function createControlPoint3Group(gui, scene, cp = new ControlPoint3()) {
  const group = new THREE.Group();
  const folder = gui.addFolder("controlPoint3Group");

  const geometry = createControlPoint3Geometry(folder, cp);

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  group.add(new THREE.Line(geometry, lineMaterial));
  group.add(new THREE.Points(geometry, pointsMaterial));

  scene.add(group);

  return group;
}
