import * as THREE from "three";

import { Plane } from "./plane.js";

/**
 * A plane at infinity. The plane is perpendicular to the curve at position u.
 *
 * ```js
 * import { VerticalPlane } from "./src/cross-section/vertical-plane.js";
 * const points = [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) ];
 * const curve = new THREE.CatmullRomCurve3( points );
 * const verticalPlane = new VerticalPlane( curve, 0 );
 * ```
 *
 * @augments Plane
 */
export class VerticalPlane extends Plane {
  /**
   * Constructs a new vertical plane.
   *
   * @param {THREE.Curve} curve - The curve.
   * @param {number} [u=0] - The position on the curve according to the arc length. Must be in the range [0, 1].
   */
  constructor(curve = new THREE.Curve(), u = 0) {
    super();

    /**
     * The curve.
     *
     * @type {THREE.Curve}
     */
    this.curve = curve;

    /**
     * The position on the curve according to the arc length. Must be in the range [0, 1].
     *
     * @type {number}
     */
    this.u = u;
  }

  /**
   * Get the normal direction of the plane.
   *
   * @returns {THREE.Vector3}
   */
  getNormal() {
    return this.curve.getTangentAt(this.u);
  }

  /**
   * Get the reference point on the plane.
   *
   * @returns {THREE.Vector3}
   */
  getPoint() {
    return this.curve.getPointAt(this.u);
  }

  /**
   * Returns a new vertical plane with copied values from this instance.
   *
   * @return {VerticalPlane} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given vertical plane to this instance.
   *
   * @param {VerticalPlane} source - The vertical plane to copy.
   * @returns {VerticalPlane} A reference to this vertical plane.
   */
  copy(source) {
    this.curve.copy(source.curve);
    this.u = source.u;

    return this;
  }

  /**
   * Serializes the vertical plane into JSON.
   *
   * @return {Object} A JSON object representing the serialized vertical plane.
   */
  toJSON() {
    const data = {};

    data.curve = this.curve.toJSON();
    data.u = this.u;

    return data;
  }

  /**
   * Deserializes the vertical plane from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized vertical plane.
   * @return {VerticalPlane} A reference to this vertical plane.
   */
  fromJSON(json) {
    this.curve.fromJSON(json.curve);
    this.u = json.u;

    return this;
  }
}
