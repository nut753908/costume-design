import * as THREE from "three";
import { ControlPoint2 } from "./control-point-2";
import { Curve } from "./curve";

/**
 * A 2D Cubic Bezier curve path using 2D control points.
 *
 * ```js
 * import { Curve2 } from "./src/curve/curve-2";
 * const curve2 = new Curve2();
 * ```
 *
 * @augments Curve<2>
 */
export class Curve2 extends Curve<2> {
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
  get curveClass(): new (
    v0: THREE.Vector2,
    v1: THREE.Vector2,
    v2: THREE.Vector2,
    v3: THREE.Vector2,
  ) => THREE.CubicBezierCurve {
    return THREE.CubicBezierCurve;
  }

  /**
   * Get the class of this.cps[*].
   */
  get cpClass(): new () => ControlPoint2 {
    return ControlPoint2;
  }
}
