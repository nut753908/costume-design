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

  /**
   * Returns a new Curve3 with copied values from this instance.
   *
   * @returns {Curve3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given Curve3 to this instance.
   *
   * @param {Curve3} source - The Curve3 to copy.
   * @returns {Curve3} A reference to this Curve3.
   */
  copy(source) {
    super.copy(source);

    return this;
  }

  /**
   * Serializes the Curve3 into JSON.
   *
   * @return {Object} A JSON object representing the serialized Curve3.
   */
  toJSON() {
    const data = super.toJSON();

    return data;
  }

  /**
   * Deserializes the Curve3 from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized Curve3.
   * @return {Curve3} A reference to this Curve3.
   */
  fromJSON(json) {
    super.fromJSON(json);

    return this;
  }
}
