import * as THREE from "three";

/**
 * A class representing a control point of curve.
 *
 * ```js
 * import { ControlPoint } from "./src/math/control-point.js";
 * const controlPoint = new ControlPoint(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, -1, 0)
 * );
 * ```
 */
export class ControlPoint {
  /**
   * Constructs a new ControlPoint.
   *
   * @param {THREE.Vector3} [offset] - An offset position for control points.
   * @param {THREE.Vector3} [up] - A vector from the offset to upside control point.
   * @param {THREE.Vector3} [down] - A vector from the offset to downside control point.
   */
  constructor(
    offset = new THREE.Vector3(0, 0, 0),
    up = new THREE.Vector3(0, 1, 0),
    down = new THREE.Vector3(0, -1, 0)
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
     * @type {THREE.Vector3}
     */
    this.up = up;

    /**
     * A vector from the offset to downside control point.
     *
     * @type {THREE.Vector3}
     */
    this.down = down;
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
    this.up.copy(other.up);
    this.down.copy(other.down);

    return this;
  }

  /**
   * Get the position of upside control point.
   *
   * @returns {THREE.Vector3}
   */
  getUpPos() {
    return this.offset.clone().add(this.up);
  }

  /**
   * Get the position of downside control point.
   *
   * @returns {THREE.Vector3}
   */
  getDownPos() {
    return this.offset.clone().add(this.down);
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction.
   */
  syncUpToDown() {
    this.sync(this.up, this.down);
  }

  /**
   * Synchronize from "down" to "up" with reversing the direction.
   */
  syncDownToUp() {
    this.sync(this.down, this.up);
  }

  /**
   * Synchronize from "up" or "down" to another with reversing the direction.
   *
   * @param {THREE.Vector3} from - The synchronization source, either "up" or "down".
   * @param {THREE.Vector3} to - The synchronization destination, which is set to another.
   */
  sync(from, to) {
    to.set(-from.x, -from.y, -from.z);
  }
}
