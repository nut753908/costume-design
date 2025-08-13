import * as THREE from "three";

import { Curve } from "./curve.js";
import { ControlPoint2 } from "./control-point-2.js";

/**
 * A 2D Cubic Bezier curve path using 2D control points.
 *
 * ```js
 * import { Curve2 } from "./src/curve/curve-2.js";
 * const c = new Curve2();
 * ```
 *
 * @augments Curve
 */
export class Curve2 extends Curve {
  /**
   * Constructs a new Curve2.
   *
   * @param {Array<ControlPoint2>} [cps=[]] - The 2D control points.
   */
  constructor(cps = []) {
    super(cps);

    this.type = "Curve2";
  }

  /**
   * Get the class of this.curves[*].
   *
   * @returns {Function}
   */
  get curveClass() {
    return THREE.CubicBezierCurve;
  }

  /**
   * Get the class of this.cps[*].
   *
   * @returns {Function}
   */
  get cpClass() {
    return ControlPoint2;
  }

  /**
   * Get the folder name used in setGUI().
   *
   * @return {string}
   */
  get name() {
    return "curve2";
  }
}
