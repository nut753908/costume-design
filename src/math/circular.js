import * as THREE from "three";

/**
 * A class representing a circular as 2D Polar coodinate.
 *
 * ```js
 * import { Circular } from "./src/math/circular.js";
 * const c = new Circular( 1, 0 );
 * ```
 */
export class Circular {
  /**
   * Constructs a new circular.
   *
   * @param {number} [radius=1] - The radius of circular. [0,]
   * @param {number} [angle=0] - The angle of circular in degrees. [0, 360]
   */
  constructor(radius = 1, angle = 0) {
    /**
     * The radius of circular. [0,]
     *
     * @type {number}
     */
    this.radius = radius;

    /**
     * The angle of circular in degrees. [0, 360]
     * The angle starts at positive x and increases counterclockwise in x-y plane.
     * In this case, positive z points forward.
     *
     * @type {number}
     */
    this.angle = angle;
  }

  /**
   * Returns a new circular with copied values from this instance.
   *
   * @returns {Circular} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given circular to this instance.
   *
   * @param {Circular} other - The circular to copy.
   * @returns {Circular} A reference to this circular.
   */
  copy(other) {
    this.radius = other.radius;
    this.angle = other.angle;

    return this;
  }

  /**
   * Get the x value as Cartesian coordinate.
   *
   * @returns {number}
   */
  x() {
    return this.radius * Math.cos(THREE.MathUtils.degToRad(this.angle));
  }
  /**
   * Get the y value as Cartesian coordinate.
   *
   * @returns {number}
   */
  y() {
    return this.radius * Math.sin(THREE.MathUtils.degToRad(this.angle));
  }

  /**
   * Set radius and angle from THREE.Vector2 v.
   *
   * @param {THREE.Vector2} v
   * @returns {Circular}
   */
  setFromVector2(v) {
    this.radius = Math.sqrt(v.x ** 2 + v.y ** 2);
    this.angle = THREE.MathUtils.radToDeg(Math.atan2(-v.y, -v.x) + Math.PI);

    return this;
  }
}
