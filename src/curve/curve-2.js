import * as THREE from "three";

import { Curve } from "./curve";
import { ControlPoint2 } from "./control-point-2";

/**
 * A 2D Cubic Bezier curve path using 2D control points.
 *
 * ```js
 * import { Curve2 } from "./src/curve/curve-2.js";
 * const c = new Curve2();
 * ```
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
   * @returns {object}
   */
  get curveClass() {
    return THREE.CubicBezierCurve;
  }

  /**
   * Get the class of this.cps[*].
   *
   * @returns {object}
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

  /**
   * Returns a new Curve2 with copied values from this instance.
   *
   * @returns {Curve2} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given Curve2 to this instance.
   *
   * @param {Curve2} source - The Curve2 to copy.
   * @returns {Curve2} A reference to this Curve2.
   */
  copy(source) {
    super.copy(source);

    return this;
  }

  /**
   * Serializes the Curve2 into JSON.
   *
   * @return {Object} A JSON object representing the serialized Curve2.
   */
  toJSON() {
    const data = super.toJSON();

    return data;
  }

  /**
   * Deserializes the Curve2 from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized Curve2.
   * @return {Curve2} A reference to this Curve2.
   */
  fromJSON(json) {
    super.fromJSON(json);

    return this;
  }
}
