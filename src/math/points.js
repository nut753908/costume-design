import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

/**
 * An abstract class with points.
 * ```
 */
export class Points {
  constructor() {}

  /**
   * Set GUI with updateGeometry.
   *
   * @param {GUI} _gui
   * @param {(p:Points)=>void} _updateGeometry - A callback that can update the geometry.
   */
  setGUI(_gui, _updateGeometry) {
    console.warn("Points: .setGUI() not implemented.");
  }

  /**
   * Get points.
   *
   * @returns {Array<THREE.Vector3>|Array<THREE.Vector2>}
   */
  getPoints() {
    console.warn("Points: .getPoints() not implemented.");

    return [];
  }
}
