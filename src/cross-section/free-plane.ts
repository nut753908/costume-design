import * as THREE from "three";

import { Plane } from "./plane";

/**
 * A free plane at infinity.
 *
 * ```js
 * import { FreePlane } from "./src/cross-section/free-plane";
 * const normal = new THREE.Vector3( 0, 1, 0 );
 * const point = new THREE.Vector3( 0, 0, 0 );
 * const freePlane = new FreePlane( normal, point );
 * ```
 *
 * @augments Plane
 */
export class FreePlane extends Plane {
  /**
   * Constructs a new free plane.
   *
   * @param {THREE.Vector3} [normal=(0,1,0)] - The normal direction of the plane. Must be a unit vector.
   * @param {THREE.Vector3} [point=(0,0,0)] - The reference point on the plane.
   */
  constructor(
    normal = new THREE.Vector3(0, 1, 0),
    point = new THREE.Vector3(0, 0, 0)
  ) {
    super();

    this.type = "FreePlane";

    /**
     * The normal direction of the plane. Must be a unit vector.
     *
     * @type {THREE.Vector3}
     */
    this.normal = normal;

    /**
     * The reference point on the plane.
     *
     * @type {THREE.Vector3}
     */
    this.point = point;
  }

  /**
   * Get the normal direction of the plane.
   *
   * @returns {THREE.Vector3}
   */
  getNormal() {
    return this.normal;
  }

  /**
   * Get the reference point on the plane.
   *
   * @returns {THREE.Vector3}
   */
  getPoint() {
    return this.point;
  }

  /**
   * Returns a new free plane with copied values from this instance.
   *
   * @return {FreePlane} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given free plane to this instance.
   *
   * @param {FreePlane} source - The free plane to copy.
   * @returns {FreePlane} A reference to this free plane.
   */
  copy(source) {
    this.normal.copy(source.normal);
    this.point.copy(source.point);

    return this;
  }

  /**
   * Serializes the free plane into JSON.
   *
   * @return {Object} A JSON object representing the serialized free plane.
   */
  toJSON() {
    const data = {};

    data.normal = this.normal.toArray();
    data.point = this.point.toArray();
    data.type = this.type;

    return data;
  }

  /**
   * Deserializes the free plane from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized free plane.
   * @return {FreePlane} A reference to this free plane.
   */
  fromJSON(json) {
    this.normal.fromArray(json.normal);
    this.point.fromArray(json.point);

    return this;
  }
}
