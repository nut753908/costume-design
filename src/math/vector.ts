import * as THREE from "three";
import { atan2In2PI } from "./utils";

/**
 * Get each angle as THREE.Vector3.
 * x:
 *   The angle of v around the x (right) axis.
 *   This angle is right-handed and starts at positive y.
 * y:
 *   The angle of v around the y (up) axis.
 *   This angle is right-handed and starts at positive z.
 * z:
 *   The angle of v around the z (front) axis.
 *   This angle is right-handed and starts at positive x.
 */
export function getAngles(v: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.radToDeg(atan2In2PI(v.z, v.y)),
    THREE.MathUtils.radToDeg(atan2In2PI(v.x, v.z)),
    THREE.MathUtils.radToDeg(atan2In2PI(v.y, v.x))
  );
}

export function mean<TVector extends THREE.Vector3 | THREE.Vector2>(
  v1: TVector,
  v2: TVector
): TVector {
  if (v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  }
  if (v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  }
  console.error(`\
!(v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3)
&& !(v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2)
- v1: ${JSON.stringify(v1)}
- v2: ${JSON.stringify(v2)}
`);
  return v1;
}
