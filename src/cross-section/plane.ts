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
   */
  getNormal(): THREE.Vector3 {
    console.warn("Plane: .getNormal() not implemented.");
    return new THREE.Vector3();
  }

  /**
   * Get the reference point on the plane.
   */
  getPoint(): THREE.Vector3 {
    console.warn("Plane: .getPoint() not implemented.");
    return new THREE.Vector3();
  }

  /**
   * Get the normal direction of the top face.
   */
  getTopNormal(): THREE.Vector3 {
    const normal = this.getNormal();
    return normal.y >= 0 ? normal : normal.clone().negate();
  }

  /**
   * Get the normal direction of the bottom face.
   */
  getBottomNormal(): THREE.Vector3 {
    const normal = this.getNormal();
    return normal.y < 0 ? normal : normal.clone().negate();
  }

  /**
   * Get the THREE.Plane instance.
   */
  getPlane(): THREE.Plane {
    const normal = this.getNormal();
    const point = this.getPoint();
    return new THREE.Plane().setFromNormalAndCoplanarPoint(normal, point);
  }
}
