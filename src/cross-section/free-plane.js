import * as THREE from "three";

import { Plane } from "./plane.js";

/**
 * A free plane at infinity.
 *
 * ```js
 * import { FreePlane } from "./src/cross-section/free-plane.js";
 * const normal = new THREE.Vector3( 0, 1, 0 );
 * const position = new THREE.Vector3( 0, 0, 0 );
 * const freePlane = new FreePlane( normal, position );
 * ```
 */
export class FreePlane extends Plane {
  /**
   * Constructs a new free plane.
   *
   * @param {THREE.Vector3} [normal=(0,0,0)] - The normal direction of the plane.
   * @param {THREE.Vector3} [position=(0,0,0)] - The reference position on the plane.
   */
  constructor(normal = new THREE.Vector3(), position = new THREE.Vector3()) {
    super();

    /**
     * The normal direction of the plane.
     *
     * @type {THREE.Vector3}
     */
    this.normal = normal;

    /**
     * The reference position on the plane.
     *
     * @type {THREE.Vector3}
     */
    this.position = position;
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
   * Get the reference position on the plane.
   *
   * @returns {THREE.Vector3}
   */
  getPosition() {
    return this.position;
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
    this.position.copy(source.position);

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
    data.position = this.position.toArray();

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
    this.position.fromArray(json.position);

    return this;
  }
}
