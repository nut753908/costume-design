// TODO: test constructor(), clone(), copy(), toJSON(), fromJSON()
// TODO: add addFreePlane(), addVerticalPlane(curveKey), removePlane(planeIndex), getCurveKeys(), getPlaneIndices()

import * as THREE from "three";

import { FreePlane } from "./free-plane.js";
import { VerticalPlane } from "./vertical-plane.js";
import { objectMap } from "../main/utils.js";

/**
 * A class for managing the increase/decrease of planes at infinity.
 *
 * ```js
 * import { PlaneManager } from "./src/cross-section/plane-manager.js";
 * const planeManager = new PlaneManager();
 * ```
 */
export class PlaneManager {
  /**
   * Constructs a new plane manager.
   *
   * @param {{[k:number|string]:THREE.CurvePath|THREE.CatmullRomCurve3}} [curves={}] - The curves to create a vertical plane.
   * @param {Array<FreePlane|VerticalPlane>} [planes=[]] - The planes at infinity.
   */
  constructor(curves = {}, planes = []) {
    super();

    /**
     * The curves to create a vertical plane.
     *
     * @type {{[k:number|string]:THREE.CurvePath|THREE.CatmullRomCurve3}}
     */
    this.curves = curves;

    /**
     * The planes at infinity.
     *
     * @type {Array<FreePlane|VerticalPlane>}
     */
    this.planes = planes;
  }

  /**
   * Returns a new plane manager with copied values from this instance.
   *
   * @return {PlaneManager} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given plane manager to this instance.
   *
   * @param {PlaneManager} source - The plane manager to copy.
   * @returns {PlaneManager} A reference to this plane manager.
   */
  copy(source) {
    this.curves = objectMap(source.curves, (v) => v.clone());
    this.planes = source.planes.map((v) => v.clone());

    return this;
  }

  /**
   * Serializes the plane manager into JSON.
   *
   * @return {Object} A JSON object representing the serialized plane manager.
   */
  toJSON() {
    const data = {};

    data.curves = objectMap(this.curves, (v) => v.toJSON());
    data.planes = this.planes.map((v) => v.toJSON());

    return data;
  }

  /**
   * Deserializes the plane manager from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized plane manager.
   * @return {PlaneManager} A reference to this plane manager.
   */
  fromJSON(json) {
    this.curves = objectMap(json.curves, (v) => {
      if (v.type === "CurvePath") {
        return new THREE.CurvePath().fromJSON(v);
      } else if (v.type === "CatmullRomCurve3") {
        return new THREE.CatmullRomCurve3().fromJSON(v);
      } else {
        console.error(`\
!(v.type === "CurvePath") && !(v.type === "CatmullRomCurve3")
- v: ${JSON.stringify(v)}
`);
      }
    });
    this.planes = json.planes.map((v) => {
      if (v.type === "FreePlane") {
        return new FreePlane().fromJSON(v);
      } else if (v.type === "VerticalPlane") {
        return new VerticalPlane().fromJSON(v);
      } else {
        console.error(`\
!(v.type === "FreePlane") && !(v.type === "VerticalPlane")
- v: ${JSON.stringify(v)}
`);
      }
    });

    return this;
  }
}
