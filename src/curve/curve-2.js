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

    this.fillAllCurves();
  }

  /**
   * Fill all curves.
   */
  fillAllCurves() {
    // example:
    //   this.cps.length : 5
    //   this.cps        : [0, 1, 2, 3, 4]
    //   this.curves     : [0, 1, 2, 3]
    this.curves = [];
    for (let i = 0, l = this.cps.length - 1; i < l; i++) {
      const curve = this.createCurve(i);
      this.curves.push(curve);
    }
    this.updateArcLengths();
  }

  /**
   * Add cp to this.cps[index] and fill curves as needed.
   *
   * @param {number} index - The index of this.cps.
   * @param {ControlPoint2} cp
   */
  addCp(index, cp) {
    if (this.isInvalidIndex(index, this.cps.length)) return;

    // Add cp to this.cps[index].
    this.cps.splice(index, 0, cp);

    // Fill curves as needed.
    if (index === 0) {
      // example:
      //   index           : 0      -> 0
      //   this.cps.length : 2      -> 3(+1)
      //   this.cps        : [0, 1] -> [0(new), 1(+1), 2(+1)]
      //   this.curves     : [0]    -> [0(new), 1(+1)]
      const curve = this.createCurve(0);
      this.curves.splice(0, 0, curve);
    } else if (index === this.cps.length - 1) {
      // example:
      //   index           : 2      -> 2
      //   this.cps.length : 2      -> 3(+1)
      //   this.cps        : [0, 1] -> [0, 1, 2(new)]
      //   this.curves     : [0]    -> [0, 1(new)]
      const curve = this.createCurve(index - 1);
      this.curves.splice(index - 1, 0, curve);
    } else {
      // example:
      //   index           : 1      -> 1
      //   this.cps.length : 2      -> 3(+1)
      //   this.cps        : [0, 1] -> [0, 1(new), 2(+1)]
      //   this.curves     : [0]    -> [0(new), 1(new)]
      const curve1 = this.createCurve(index - 1);
      const curve2 = this.createCurve(index);
      this.curves.splice(index - 1, 1, curve1, curve2);
    }
    this.updateArcLengths();
  }

  /**
   * Remove this.cps[index] and fill curves as needed.
   *
   * @param {number} index - The index of this.cps.
   */
  removeCp(index) {
    if (this.isInvalidIndex(index, this.cps.length - 1)) return;

    // Remove this.cps[index].
    this.cps.splice(index, 1);

    // Fill curves as needed.
    if (index === 0) {
      // example:
      //   index           : 0         -> 0
      //   this.cps.length : 3         -> 2(-1)
      //   this.cps        : [0, 1, 2] -> [0(-1), 1(-1)]
      //   this.curves     : [0, 1]    -> [0(-1)]
      this.curves.splice(0, 1);
    } else if (index === this.cps.length) {
      // example:
      //   index           : 2         -> 2
      //   this.cps.length : 3         -> 2(-1)
      //   this.cps        : [0, 1, 2] -> [0, 1]
      //   this.curves     : [0, 1]    -> [0]
      this.curves.splice(index - 1, 1);
    } else {
      // example:
      //   index           : 1         -> 1
      //   this.cps.length : 3         -> 2(-1)
      //   this.cps        : [0, 1, 2] -> [0, 1(-1)]
      //   this.curves     : [0, 1]    -> [0(new)]
      const curve = this.createCurve(index - 1);
      this.curves.splice(index - 1, 2, curve);
    }
    this.updateArcLengths();
  }

  /**
   * Update this.cps[index] and fill curves as needed.
   *
   * @param {number} index - The index of this.cps.
   * @param {ControlPoint2?} cp
   */
  updateCp(index, cp = null) {
    if (this.isInvalidIndex(index, this.cps.length - 1)) return;

    // Update this.cps[index].
    // ("this.cps[index]" may already be updated.)
    if (cp) this.cps[index].copy(cp);

    // Fill curves as needed.
    if (index === 0) {
      // example:
      //   index             : 0
      //   this.cps.length   : 3
      //   this.cps          : [0, 1, 2]
      //   this.curves       : [0, 1]
      const curve = this.createCurve(0);
      this.curves.splice(0, 1, curve);
    } else if (index === this.cps.length - 1) {
      // example:
      //   index             : 2
      //   this.cps.length   : 3
      //   this.cps          : [0, 1, 2]
      //   this.curves       : [0, 1]
      const curve = this.createCurve(index - 1);
      this.curves.splice(index - 1, 1, curve);
    } else {
      // example:
      //   index             : 1
      //   this.cps.length   : 3
      //   this.cps          : [0, 1, 2]
      //   this.curves       : [0, 1]
      const curve1 = this.createCurve(index - 1);
      const curve2 = this.createCurve(index);
      this.curves.splice(index - 1, 2, curve1, curve2);
    }
    this.updateArcLengths();
  }

  /**
   * Create a 2D Cubic Bezier curve using both this.cps[index] and this.cps[index + 1].
   *
   * @param {number} index - The index of this.cps.
   */
  createCurve(index) {
    if (this.isInvalidIndex(index, this.cps.length - 2)) return;
    return new THREE.CubicBezierCurve(
      this.cps[index].middlePos.clone(),
      this.cps[index].rightPos.clone(),
      this.cps[index + 1].leftPos.clone(),
      this.cps[index + 1].middlePos.clone()
    );
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
