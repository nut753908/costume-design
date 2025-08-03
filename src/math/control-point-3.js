import * as THREE from "three";

/**
 * A class representing a 3D control point of curve.
 *
 * ```js
 * import { ControlPoint3 } from "./src/math/control-point-3.js";
 * const cp = new ControlPoint3(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, -1, 0),
 *   true
 * );
 * ```
 */
export class ControlPoint3 {
  /**
   * Constructs a new ControlPoint3.
   *
   * @param {THREE.Vector3} [offset] - An offset position for control points.
   * @param {THREE.Vector3|THREE.Spherical} [up] - A vector from the offset to upside control point.
   * @param {THREE.Vector3|THREE.Spherical} [down] - A vector from the offset to downside control point.
   * @param {boolean} [isSync=true] - Whether to synchronize "up" and "down".
   */
  constructor(
    offset = new THREE.Vector3(0, 0, 0),
    up = new THREE.Vector3(0, 1, 0),
    down = new THREE.Vector3(0, -1, 0),
    isSync = true
  ) {
    /**
     * An offset position for control points.
     *
     * @type {THREE.Vector3}
     */
    this.offset = offset;

    /**
     * A vector from the offset to upside control point.
     *
     * @type {THREE.Vector3|THREE.Spherical}
     */
    this.initUp(up);

    /**
     * A vector from the offset to downside control point.
     *
     * @type {THREE.Vector3|THREE.Spherical}
     */

    this.initDown(down);

    /**
     * Whether to synchronize "up" and "down".
     *
     * @type {boolean}
     */
    this.isSync = isSync;
  }

  /**
   * Returns a new ControlPoint3 with copied values from this instance.
   *
   * @returns {ControlPoint3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given ControlPoint3 to this instance.
   *
   * @param {ControlPoint3} other - The ControlPoint3 to copy.
   * @returns {ControlPoint3} A reference to this ControlPoint3.
   */
  copy(other) {
    this.offset.copy(other.offset);
    this.upV.copy(other.upV);
    this.upS.copy(other.upS);
    this.downV.copy(other.downV);
    this.downS.copy(other.downS);
    this.isSync = other.isSync;

    return this;
  }

  /**
   * Initialize "up", which splits into "upV" and "upS".
   * "upV" is "up" and its type is THREE.'V'ector3.
   * "upS" is "up" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initUp(up) {
    this.upV = new THREE.Vector3();
    this.upS = new THREE.Spherical();
    if (up instanceof THREE.Vector3) {
      this.upV.copy(up);
      this.upS.setFromVector3(up);
    } else if (up instanceof THREE.Spherical) {
      this.upV.setFromSpherical(up);
      this.upS.copy(up);
    }
  }
  /**
   * Initialize "down", which splits into "downV" and "downS".
   * "downV" is "down" and its type is THREE.'V'ector3.
   * "downS" is "down" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initDown(down) {
    this.downV = new THREE.Vector3();
    this.downS = new THREE.Spherical();
    if (down instanceof THREE.Vector3) {
      this.downV.copy(down);
      this.downS.setFromVector3(down);
    } else if (down instanceof THREE.Spherical) {
      this.downV.setFromSpherical(down);
      this.downS.copy(down);
    }
  }

  updateFrom = {
    upV: () => this.updateFromUpV(),
    upS: () => this.updateFromUpS(),
    downV: () => this.updateFromDownV(),
    downS: () => this.updateFromDownS(),
  };

  /**
   * Update "upS" from "upV" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpV() {
    this.upS.setFromVector3(this.upV);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "downS" from "downV" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownV() {
    this.downS.setFromVector3(this.downV);
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * Update "upV" from "upS" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpS() {
    this.upV.setFromSpherical(this.upS);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "downV" from "downS" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownS() {
    this.downV.setFromSpherical(this.downS);
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction.
   */
  syncUpToDown() {
    this.downV.copy(this.upV.clone().negate());
    this.downS.setFromVector3(this.downV);
  }
  /**
   * Synchronize from "down" to "up" with reversing the direction.
   */
  syncDownToUp() {
    this.upV.copy(this.downV.clone().negate());
    this.upS.setFromVector3(this.upV);
  }

  /**
   * Get the position of upside control point.
   *
   * @returns {THREE.Vector3}
   */
  get upPos() {
    return this.offset.clone().add(this.upV);
  }
  /**
   * Get the position of downside control point.
   *
   * @returns {THREE.Vector3}
   */
  get downPos() {
    return this.offset.clone().add(this.downV);
  }
}
