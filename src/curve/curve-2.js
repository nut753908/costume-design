import * as THREE from "three";

import { ControlPoint2 } from "./control-point-2";

/**
 * A 2D Cubic Bezier curve path using 2D control points.
 *
 * ```js
 * import { Curve2 } from "./src/curve/curve-2.js";
 * const c = new Curve2();
 * ```
 */
export class Curve2 extends THREE.CurvePath {
  /**
   * Constructs a new Curve2.
   *
   * @param {Array<ControlPoint2>} [cps=[]] - The 2D control points.
   */
  constructor(cps = []) {
    super();

    this.type = "Curve2";

    /**
     * The 2D control points.
     *
     * @type {Array<ControlPoint2>}
     */
    this.cps = cps;
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

    this.cps = [];

    for (let i = 0, l = source.cps.length; i < l; i++) {
      const cp = source.cps[i];
      this.cps.push(cp.clone());
    }

    return this;
  }

  /**
   * Serializes the Curve2 into JSON.
   *
   * @return {Object} A JSON object representing the serialized Curve2.
   */
  toJSON() {
    const data = super.toJSON();

    data.cps = [];

    for (let i = 0, l = this.cps.length; i < l; i++) {
      const cp = this.cps[i];
      data.cps.push(cp.toJSON());
    }

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

    this.cps = [];

    for (let i = 0, l = json.cps.length; i < l; i++) {
      const cp = json.cps[i];
      this.cps.push(new ControlPoint2().fromJSON(cp));
    }

    return this;
  }
}
