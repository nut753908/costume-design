import * as THREE from "three";

/**
 * Abstract class for FreePlane and VerticalPlane.
 */
export abstract class Plane {
  /**
   * Constructs a new plane.
   */
  constructor() {}

  /**
   * Get the normal direction of the plane.
   */
  abstract getNormal(): THREE.Vector3;

  /**
   * Get the reference point on the plane.
   */
  abstract getPoint(): THREE.Vector3;

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
