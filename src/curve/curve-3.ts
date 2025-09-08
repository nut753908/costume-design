import * as THREE from "three";

import { Curve } from "./curve";
import { ControlPoint3 } from "./control-point-3";

/**
 * A 3D Cubic Bezier curve path using 3D control points.
 *
 * ```js
 * import { Curve3 } from "./src/curve/curve-3";
 * const curve3 = new Curve3();
 * ```
 *
 * @augments Curve<3>
 */
export class Curve3 extends Curve<3> {
  type: string;

  /**
   * Constructs a new Curve3.
   *
   * @param cps - The 3D control points.
   */
  constructor(cps: ControlPoint3[] = []) {
    super(cps);

    this.type = "Curve3";
  }

  /**
   * Get the class of this.curves[*].
   */
  get curveClass(): Function {
    return THREE.CubicBezierCurve3;
  }

  /**
   * Get the class of this.cps[*].
   */
  get cpClass(): Function {
    return ControlPoint3;
  }
}
