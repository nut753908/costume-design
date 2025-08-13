import * as THREE from "three";

import { Curve } from "./curve.js";
import { ControlPoint3 } from "./control-point-3.js";

/**
 * A 3D Cubic Bezier curve path using 3D control points.
 *
 * ```js
 * import { Curve3 } from "./src/curve/curve-3.js";
 * const c = new Curve3();
 * ```
 *
 * @augments Curve
 */
export class Curve3 extends Curve {
  /**
   * Constructs a new Curve3.
   *
   * @param {Array<ControlPoint3>} [cps=[]] - The 3D control points.
   */
  constructor(cps = []) {
    super(cps);

    this.type = "Curve3";
  }

  /**
   * Get the class of this.curves[*].
   *
   * @returns {Function}
   */
  get curveClass() {
    return THREE.CubicBezierCurve3;
  }

  /**
   * Get the class of this.cps[*].
   *
   * @returns {Function}
   */
  get cpClass() {
    return ControlPoint3;
  }

  /**
   * Get the folder name used in setGUI().
   *
   * @return {string}
   */
  get name() {
    return "curve3";
  }
}
