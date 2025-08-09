import * as THREE from "three";

import { ControlPoint2 } from "./control-point-2";
import { isInvalidIndex } from "../math/utils";

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
   * Update curves using this.cps.
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

  // TODO: refactor this method.
  // TODO: Add cps GUI.
  // TODO: Create the geometries for the cps.
  /**
   * Create geometry and set GUI.
   *
   * @param {GUI} gui
   * @returns {THREE.BufferGeometry}
   */
  createGeometry(gui) {
    const c = this;

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(c.getPoints());

    const obj = {
      addCpToFirst: () => {
        c.addCpToFirst();
        update();
      },
      addCpToLast: () => {
        c.addCpToLast();
        update();
      },
      indexI: 1,
      interpolateCp: () => {
        c.interpolateCp(obj.indexI);
        update();
      },
      indexR: 1,
      removeCp: () => {
        c.removeCp(obj.indexR);
        update();
      },
    };

    const folder = gui.addFolder("c");
    folder.add(obj, "addCpToFirst");
    folder.add(obj, "addCpToLast");
    const ii = folder.add(obj, "indexI").options(c.indexListI);
    const icp = folder.add(obj, "interpolateCp");
    const ir = folder.add(obj, "indexR").options(c.indexListR);
    const rcp = folder.add(obj, "removeCp");
    if (c.indexListI.indexOf(obj.indexI) !== -1) {
      icp.enable();
    } else {
      icp.disable();
    }
    if (c.indexListR.indexOf(obj.indexI) !== -1) {
      rcp.enable();
    } else {
      rcp.disable();
    }

    function update() {
      ii.options(c.indexListI);
      if (c.indexListI.indexOf(obj.indexI) !== -1) {
        icp.enable();
      } else {
        icp.disable();
      }
      ir.options(c.indexListR);
      if (c.indexListR.indexOf(obj.indexI) !== -1) {
        rcp.enable();
      } else {
        rcp.disable();
      }
      c.updateCurves();
      geometry.setFromPoints(c.getPoints());
    }

    return geometry;
  }

  /**
   * Add cp to the beginning of this.cps.
   */
  addCpToFirst() {
    if (this.cps.length !== 0) {
      this.cps.unshift(this.cps[0].clone()); // Copy first cp.
    } else {
      this.cps.unshift(new ControlPoint2());
    }
  }

  /**
   * Add cp to the end of this.cps.
   */
  addCpToLast() {
    if (this.cps.length !== 0) {
      this.cps.push(this.cps[this.cps.length - 1].clone()); // Copy last cp.
    } else {
      this.cps.push(new ControlPoint2());
    }
  }

  /**
   * Interpolate cp2 using cp1 and cp3. This method also affects cp1 and cp3.
   *
   * @param {number} index - The index of this.cps. It is used as reference for cp1, cp2 and cp3.
   */
  interpolateCp(index) {
    if (isInvalidIndex(index, 1, this.cps.length - 1)) return;
    this.cps.splice(index, 0, this.cps[index].clone());
    const cp1 = this.cps[index - 1];
    const cp2 = this.cps[index];
    const cp3 = this.cps[index + 1];
    const centerPos = cp1.rightPos.clone().add(cp3.leftPos).divideScalar(2);
    cp1.rightPos = cp1.middlePos.clone().add(cp1.rightPos).divideScalar(2);
    cp3.leftPos = cp3.leftPos.clone().add(cp3.middlePos).divideScalar(2);
    cp2.leftPos = cp1.rightPos.clone().add(centerPos).divideScalar(2);
    cp2.rightPos = centerPos.clone().add(cp3.leftPos).divideScalar(2);
    cp2.middlePos = cp2.leftPos.clone().add(cp2.rightPos).divideScalar(2);
  }

  /**
   * Remove this.cps[index].
   *
   * @param {number} index - The index of this.cps.
   */
  removeCp(index) {
    if (isInvalidIndex(index, 0, this.cps.length - 1)) return;
    this.cps.splice(index, 1);
  }

  /**
   * Get the index list for interpolateCp(index).
   *
   * @returns {Array<number>}
   */
  get indexListI() {
    return this.indexListR.slice(1);
  }

  /**
   * Get the index list for removeCp(index).
   *
   * @returns {Array<number>}
   */
  get indexListR() {
    return [...Array(this.cps.length).keys()];
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
