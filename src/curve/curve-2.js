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

    this.updateCurves();
  }

  /**
   * Update curves.
   */
  updateCurves() {
    this.curves = [];
    for (let i = 0, l = this.cps.length - 1; i < l; i++) {
      const curve = new THREE.CubicBezierCurve(
        this.cps[i].middlePos.clone(),
        this.cps[i].rightPos.clone(),
        this.cps[i + 1].leftPos.clone(),
        this.cps[i + 1].middlePos.clone()
      );
      this.curves.push(curve);
    }
    this.updateArcLengths();
  }

  /**
   * Add cp to this.cps[index].
   *
   * @param {number} index - The index of this.cps.
   * @param {ControlPoint2} cp
   */
  addCp(index, cp) {
    if (this.isInvalidIndex(index, this.cps.length)) return;
    this.cps.splice(index, 0, cp);
  }

  /**
   * Remove this.cps[index].
   *
   * @param {number} index - The index of this.cps.
   */
  removeCp(index) {
    if (this.isInvalidIndex(index, this.cps.length - 1)) return;
    this.cps.splice(index, 1);
  }

  /**
   * Update this.cps[index].
   *
   * @param {number} index - The index of this.cps.
   * @param {ControlPoint2} cp
   */
  updateCp(index, cp) {
    if (this.isInvalidIndex(index, this.cps.length - 1)) return;
    this.cps[index].copy(cp);
  }

  /**
   * Whether the index (including the max) is invalid.
   *
   * @param {number} index - The index of this.cps.
   * @param {number} max - The max of the index.
   * @return {boolean}
   */
  isInvalidIndex(index, max) {
    if (!Number.isInteger(index)) {
      console.error(`the index(${index}) is not integer.`);
      return true;
    }
    if (!Number.isInteger(max)) {
      console.error(`the max(${max}) is not integer.`);
      return true;
    }
    if (index < 0 || index > max) {
      console.error(`the index(${index}) is out of range [0,${max}].`);
      return true;
    }
    return false;
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
