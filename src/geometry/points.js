import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Points } from "../math/points.js";

/**
 * @param {GUI} gui
 * @param {Points} p
 */
export function createGeometryFromPoints(gui, p) {
  const geometry = new THREE.BufferGeometry();
  p.setGUI(gui, getUpdateGeometry(geometry));
  return geometry;
}

/**
 * @param {THREE.BufferGeometry} geometry
 */
function getUpdateGeometry(geometry) {
  /**
   * @param {Points} p
   */
  return function updateGeometry(p) {
    const points = p.getPoints();
    geometry.setFromPoints(points);
  };
}
