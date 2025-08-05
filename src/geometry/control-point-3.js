import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint3 } from "../math/control-point-3.js";

/**
 * @param {GUI} gui
 * @param {ControlPoint3} cp
 */
export function createControlPoint3Geometry(gui, cp = new ControlPoint3()) {
  const geometry = new THREE.BufferGeometry();
  cp.setGUI(gui, getUpdateGeometry(geometry));
  return geometry;
}

/**
 * @param {THREE.BufferGeometry} geometry
 */
function getUpdateGeometry(geometry) {
  /**
   * @param {ControlPoint3} cp
   */
  return function updateGeometry(cp) {
    const vertices = [
      ...cp.upPos.toArray(),
      ...cp.middlePos.toArray(),
      ...cp.downPos.toArray(),
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
  };
}
