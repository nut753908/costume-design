import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint2 } from "../curve/control-point-2.js";

/**
 * @param {GUI} gui
 * @param {ControlPoint2} cp
 */
export function createControlPoint2Geometry(gui, cp = new ControlPoint2()) {
  const geometry = new THREE.BufferGeometry();
  cp.setGUI(gui, getUpdateGeometry(geometry));
  return geometry;
}

/**
 * @param {THREE.BufferGeometry} geometry
 */
function getUpdateGeometry(geometry) {
  /**
   * @param {ControlPoint2} cp
   */
  return function updateGeometry(cp) {
    const vertices = [
      cp.leftPos.x,
      cp.leftPos.y,
      0,
      cp.middlePos.x,
      cp.middlePos.y,
      0,
      cp.rightPos.x,
      cp.rightPos.y,
      0,
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
  };
}
