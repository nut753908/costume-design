import * as THREE from "three";

/**
 * A class representing a control point of curve.
 *
 * ```js
 * import { ControlPoint } from "./src/math/control-point.js";
 * const controlPoint = new ControlPoint(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Spherical(1, 0, 0),
 *   new THREE.Spherical(1, Math.PI, 0)
 * );
 * ```
 */
export class ControlPoint {
  /**
   * Constructs a new ControlPoint.
   *
   * @param {THREE.Vector3} [offset] - An offset position for control points.
   * @param {THREE.Spherical} [up] - A spherical vector from the offset to upside control point.
   * @param {THREE.Spherical} [down] - A spherical vector from the offset to downside control point.
   */
  constructor(
    offset = new THREE.Vector3(0, 0, 0),
    up = new THREE.Spherical(1, 0, 0),
    down = new THREE.Spherical(1, Math.PI, 0)
  ) {
    /**
     * An offset position for control points.
     *
     * @type {THREE.Vector3}
     */
    this.offset = offset;

    /**
     * A spherical vector from the offset to upside control point.
     *
     * @type {THREE.Spherical}
     */
    this.up = up;

    /**
     * A spherical vector from the offset to downside control point.
     *
     * @type {THREE.Spherical}
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
    return this.offset
      .clone()
      .add(new THREE.Vector3().setFromSpherical(this.up));
  }

  /**
   * Get the position of downside control point.
   *
   * @returns {THREE.Vector3}
   */
  getDownPos() {
    return this.offset
      .clone()
      .add(new THREE.Vector3().setFromSpherical(this.down));
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
   * @param {THREE.Spherical} from - The synchronization source, either "up" or "down".
   * @param {THREE.Spherical} to - The synchronization destination, which is set to another.
   */
  sync(from, to) {
    to.set(
      from.radius,
      Math.PI - from.phi,
      from.theta < Math.PI ? from.theta + Math.PI : from.theta - Math.PI
    );
  }
}
