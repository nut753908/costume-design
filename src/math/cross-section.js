import * as THREE from "three";

/**
 * A class representing a cross section of hair bundle.
 *
 * ```js
 * import { CrossSection } from "./src/math/cross-section.js";
 * const cs = new CrossSection( ... );
 * ```
 */
export class CrossSection {
  /**
   * Constructs a new cross section.
   *
   * @param {THREE.Vector3} [offset] - The offset position of the cross section.
   * @param {THREE.Vector3|THREE.Spherical} [dir] - The y direction of the cross section.
   * @param {number} [xRadius=1] - The cross section radius in the x direction.
   * @param {number} [zRadius=1] - The cross section radius in the z direction.
   * @param {number} [rotation] - The rotation angle of the cross section in radians, counterclockwise from the positive X axis.
   */
  constructor(offset = new THREE.Vector3(0, 0, 0)) {
    /**
     * The offset position of the cross section.
     *
     * @type {THREE.Vector3}
     */
    this.offset = offset;
  }

  /**
   * Returns a new cross section with copied values from this instance.
   *
   * @returns {CrossSection} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given cross section to this instance.
   *
   * @param {CrossSection} other - The cross section to copy.
   * @returns {CrossSection} A reference to this cross section.
   */
  copy(other) {
    this.offset.copy(other.offset);

    return this;
  }
}
