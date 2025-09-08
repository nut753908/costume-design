import * as THREE from "three";
import { ControlPoint3 } from "./control-point-3";
import { Curve } from "./curve";

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
  get curveClass(): new (
    v0: THREE.Vector3,
    v1: THREE.Vector3,
    v2: THREE.Vector3,
    v3: THREE.Vector3
  ) => THREE.CubicBezierCurve3 {
    return THREE.CubicBezierCurve3;
  }

  /**
   * Get the class of this.cps[*].
   */
  get cpClass(): new () => ControlPoint3 {
    return ControlPoint3;
  }
}
