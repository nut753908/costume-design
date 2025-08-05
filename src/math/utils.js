import * as THREE from "three";

/**
 * Safely calculate Math.asin().
 * If the hypotenuse is 0, return 0 instead of NaN.
 * If the result of "opposite / hypotenuse" is greater than 1, return 1.5707963267948966 (π/2) instead of NaN.
 * If the result of "opposite / hypotenuse" is less than -1, return -1.5707963267948966 (-π/2) instead of NaN.
 *
 * @param {number} opposite
 * @param {number} hypotenuse
 * @returns {number}
 */
export function safeAsin(opposite, hypotenuse) {
  if (hypotenuse === 0) return 0;
  return Math.asin(THREE.MathUtils.clamp(opposite / hypotenuse, -1, 1));
}
/**
 * Safely calculate Math.acos().
 * If the hypotenuse is 0, return 0 instead of NaN.
 * If the result of "adjacent / hypotenuse" is greater than 1, return 0 instead of NaN.
 * If the result of "adjacent / hypotenuse" is less than -1, return 3.141592653589793 (π) instead of NaN.
 *
 * @param {number} adjacent
 * @param {number} hypotenuse
 * @returns {number}
 */
export function safeAcos(adjacent, hypotenuse) {
  if (hypotenuse === 0) return 0;
  return Math.acos(THREE.MathUtils.clamp(adjacent / hypotenuse, -1, 1));
}
