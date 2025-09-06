import * as THREE from "three";

/**
 * The class that extends from THREE.Spherical.
 *
 * ```js
 * import { Spherical } from "./src/math/spherical.js";
 * const s = new Spherical( 1, 0, 0 );
 * ```
 *
 * @augments THREE.Spherical
 */
export class Spherical extends THREE.Spherical {
  /**
   * Constructs a new spherical.
   *
   * @param {number} [radius=1] - The radius, or the Euclidean distance (straight-line distance) from the point to the origin.
   * @param {number} [phi=0] - The polar angle in radians from the y (up) axis.
   * @param {number} [theta=0] - The equator/azimuthal angle in radians around the y (up) axis.
   */
  constructor(radius = 1, phi = 0, theta = 0) {
    super(radius, phi, theta);
  }

  /**
   * Serializes the spherical into JSON.
   *
   * @return {Object} A JSON object representing the serialized spherical.
   */
  toJSON() {
    const data = {};

    data.radius = this.radius;
    data.phi = this.phi;
    data.theta = this.theta;

    return data;
  }

  /**
   * Deserializes the spherical from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized spherical.
   * @return {Spherical} A reference to this spherical.
   */
  fromJSON(json) {
    this.set(json.radius, json.phi, json.theta);

    return this;
  }
}
