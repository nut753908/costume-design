import * as THREE from "three";

/**
 * A class representing a control point of curve.
 *
 * ```js
 * import { ControlPoint } from "./src/math/control-point.js";
 * const controlPoint = new ControlPoint(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, -1, 0),
 *   true
 * );
 * ```
 */
export class ControlPoint {
  /**
   * Constructs a new ControlPoint.
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
   * Returns a new ControlPoint with copied values from this instance.
   *
   * @returns {ControlPoint} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given ControlPoint to this instance.
   *
   * @param {ControlPoint} other - The ControlPoint to copy.
   * @returns {ControlPoint} A reference to this ControlPoint.
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
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initUp(up) {
    this.upS = new THREE.Spherical();
    this.upV = new THREE.Vector3();
    if (up instanceof THREE.Vector3) {
      this.setUpV(up);
    } else if (up instanceof THREE.Spherical) {
      this.setUpS(up);
    }
  }
  /**
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initDown(down) {
    this.downS = new THREE.Spherical();
    this.downV = new THREE.Vector3();
    if (down instanceof THREE.Vector3) {
      this.setDownV(down);
    } else if (down instanceof THREE.Spherical) {
      this.setDownS(down);
    }
  }

  /**
   * @param {THREE.Vector3} upV
   */
  setUpV(upV) {
    this.upV.copy(upV);
    this.upS.setFromVector3(upV);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * @param {THREE.Vector3} downV
   */
  setDownV(downV) {
    this.downV.copy(downV);
    this.downS.setFromVector3(downV);
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * @param {THREE.Spherical} upS
   */
  setUpS(upS) {
    this.upV.setFromSpherical(upS);
    this.upS.copy(upS);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * @param {THREE.Spherical} downS
   */
  setDownS(downS) {
    this.downV.setFromSpherical(downS);
    this.downS.copy(downS);
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * Get the position of upside control point.
   *
   * @returns {THREE.Vector3}
   */
  getUpPos() {
    return this.offset.clone().add(this.upV);
  }

  /**
   * Get the position of downside control point.
   *
   * @returns {THREE.Vector3}
   */
  getDownPos() {
    return this.offset.clone().add(this.downV);
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
}
