import * as THREE from "three";

import { Curve } from "./curve";
import { ControlPoint2 } from "./control-point-2";

/**
 * A 2D Cubic Bezier curve path using 2D control points.
 *
 * ```js
 * import { Curve2 } from "./src/curve/curve-2";
 * const curve2 = new Curve2();
 * ```
 *
 * @augments Curve<THREE.Vector2>
 */
export class Curve2 extends Curve<THREE.Vector2> {
  type: string;

  /**
   * Constructs a new Curve2.
   *
   * @param cps - The 2D control points.
   */
  constructor(cps: ControlPoint2[] = []) {
    super(cps);

    this.type = "Curve2";
  }

  /**
   * Get the class of this.curves[*].
   */
  get curveClass(): Function {
    return THREE.CubicBezierCurve;
  }

  /**
   * Get the class of this.cps[*].
   */
  get cpClass(): Function {
    return ControlPoint2;
  }
}
