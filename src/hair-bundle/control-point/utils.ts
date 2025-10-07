import * as THREE from "three";

/**
 * Safely calculate Math.asin().
 * If the hypotenuse is 0, return 0 instead of NaN.
 * If the result of "opposite / hypotenuse" is greater than 1, return 1.5707963267948966 (π/2) instead of NaN.
 * If the result of "opposite / hypotenuse" is less than -1, return -1.5707963267948966 (-π/2) instead of NaN.
 */
export function safeAsin(opposite: number, hypotenuse: number): number {
  if (hypotenuse === 0) return 0;
  return Math.asin(THREE.MathUtils.clamp(opposite / hypotenuse, -1, 1));
}
/**
 * Safely calculate Math.acos().
 * If the hypotenuse is 0, return 0 instead of NaN.
 * If the result of "adjacent / hypotenuse" is greater than 1, return 0 instead of NaN.
 * If the result of "adjacent / hypotenuse" is less than -1, return 3.141592653589793 (π) instead of NaN.
 */
export function safeAcos(adjacent: number, hypotenuse: number): number {
  if (hypotenuse === 0) return 0;
  return Math.acos(THREE.MathUtils.clamp(adjacent / hypotenuse, -1, 1));
}

/**
 * Calculate atan2 with the result in the range [0,2π].
 */
export function atan2In2PI(y: number, x: number): number {
  return Math.atan2(-y, -x) + Math.PI;
}

/**
 * Get the reversed angle in the range [0,π].
 *
 * @param angle - The angle in radians.
 * @return  The reversed angle in radians.
 */
export function reverseInPI(angle: number): number {
  return Math.PI - angle;
}

/**
 * Get the angle rotated π in the range [0,2π].
 *
 * @param angle - The angle in radians.
 * @return  The rotated angle in radians.
 */
export function rotatePI(angle: number): number {
  return angle < Math.PI ? angle + Math.PI : angle - Math.PI;
}

/**
 * Get the angle rotated 180 degrees in tha range [0,360].
 *
 * @param angle - The angle in degrees.
 * @return  The rotated angle in degrees.
 */
export function rotate180(angle: number): number {
  return angle < 180 ? angle + 180 : angle - 180;
}

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
