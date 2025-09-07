import * as THREE from "three";

/**
 * A plane at infinity.
 *
 * ```js
 * import { Plane } from "./src/cross-section/plane";
 * const plane = new Plane();
 * ```
 */
export class Plane {
  /**
   * Constructs a new plane.
   */
  constructor() {}

  /**
   * Get the normal direction of the plane.
   *
   * @returns {THREE.Vector3}
   */
  getNormal() {
    console.warn("Plane: .getNormal() not implemented.");
  }

  /**
   * Get the reference point on the plane.
   *
   * @returns {THREE.Vector3}
   */
  getPoint() {
    console.warn("Plane: .getPoint() not implemented.");
  }

  /**
   * Get the normal direction of the top face.
   *
   * @returns {THREE.Vector3}
   */
  getTopNormal() {
    const normal = this.getNormal();
    return normal.y >= 0 ? normal : normal.clone().negate();
  }

  /**
   * Get the normal direction of the bottom face.
   *
   * @returns {THREE.Vector3}
   */
  getBottomNormal() {
    const normal = this.getNormal();
    return normal.y < 0 ? normal : normal.clone().negate();
  }

  /**
   * Get the THREE.Plane instance.
   *
   * @returns {THREE.Plane}
   */
  getPlane() {
    const normal = this.getNormal();
    const point = this.getPoint();
    return new THREE.Plane().setFromNormalAndCoplanarPoint(normal, point);
  }
}
