import * as THREE from "three";

import { Plane } from "./plane.js";

/**
 * A vertical plane at infinity.
 *
 * ```js
 * import { VerticalPlane } from "./src/cross-section/vertical-plane.js";
 * const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)];
 * const line = new THREE.LineCurve3(points[0], points[1]);
 * const linePath = new THREE.CurvePath();
 * linePath.add( line );
 * const verticalPlane = new VerticalPlane( linePath, 0 );
 * ```
 */
export class VerticalPlane extends Plane {
  /**
   * Constructs a new vertical plane.
   *
   * @param {THREE.CurvePath} linePath - The line path.
   * @param {number} [u=0] - The position on the line path according to the arc length. Must be in the range [0, 1].
   */
  constructor(linePath = new THREE.CurvePath(), u = 0) {
    super();

    /**
     * The line path.
     *
     * @type {THREE.CurvePath}
     */
    this.linePath = linePath;

    /**
     * The position on the line path according to the arc length. Must be in the range [0, 1].
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
    return this.linePath.getTangentAt(this.u);
  }

  /**
   * Get the reference position on the plane.
   *
   * @returns {THREE.Vector3}
   */
  getPosition() {
    return this.linePath.getPointAt(this.u);
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
    this.linePath.copy(source.linePath);
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

    data.linePath = this.linePath.toJSON();
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
    this.linePath.fromJSON(json.linePath);
    this.u = json.u;

    return this;
  }
}
