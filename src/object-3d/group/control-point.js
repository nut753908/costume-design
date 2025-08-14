import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint3 } from "../../curve/control-point-3.js";
import { ControlPoint2 } from "../../curve/control-point-2.js";
import { createEmptyGeometry } from "../../geometry/empty.js";

/**
 * @param {GUI} gui
 * @param {ControlPoint3|ControlPoint2} cp
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createControlPointGroup(gui, cp, ms) {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Points(geometry, ms.cp.points));
  group.add(new THREE.Line(geometry, ms.cp.line));

  cp.createGeometry(group);
  cp.setGUI(gui);

  return group;
}
