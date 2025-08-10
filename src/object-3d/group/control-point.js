import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint3 } from "../../curve/control-point-3.js";
import { ControlPoint2 } from "../../curve/control-point-2.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {ControlPoint3|ControlPoint2} cp
 * @param {THREE.Scene} scene
 * @return {THREE.Group}
 */
export function createControlPointGroup(gui, cp, scene) {
  const group = new THREE.Group();
  const folder = gui.addFolder("controlPointGroup");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  group.add(new THREE.Line(geometry, lineMaterial));
  group.add(new THREE.Points(geometry, pointsMaterial));

  cp.createGeometry(group);
  cp.setGUI(folder);

  scene.add(group);

  return group;
}
