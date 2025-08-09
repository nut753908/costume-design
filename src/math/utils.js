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

/**
 * Calculate atan2 with the result in the range [0,2π].
 *
 * @param {number} y
 * @param {number} x
 * @returns {number}
 */
export function atan2In2PI(y, x) {
  return Math.atan2(-y, -x) + Math.PI;
}

/**
 * Get the reversed angle in the range [0,π].
 *
 * @param {number} angle - The angle in radians.
 * @returns {number} The reversed angle in radians.
 */
export function reverseInPI(angle) {
  return Math.PI - angle;
}

/**
 * Get the angle rotated π in the range [0,2π].
 *
 * @param {number} angle - The angle in radians.
 * @returns {number} The rotated angle in radians.
 */
export function rotatePI(angle) {
  return angle < Math.PI ? angle + Math.PI : angle - Math.PI;
}

/**
 * Get the angle rotated 180 degrees in tha range [0,360].
 *
 * @param {number} angle - The angle in degrees.
 * @returns {number} - The rotated angle in degrees.
 */
export function rotate180(angle) {
  return angle < 180 ? angle + 180 : angle - 180;
}

/**
 * Whether the index (including the min and the max) is invalid.
 *
 * @param {number} index - The index of this.cps.
 * @param {number} min - The min of the index.
 * @param {number} max - The max of the index.
 * @return {boolean}
 */
export function isInvalidIndex(index, min, max) {
  if (!Number.isInteger(index)) {
    console.error(`the index(${index}) is not integer.`);
    return true;
  }
  if (!Number.isInteger(min)) {
    console.error(`the min(${min}) is not integer.`);
    return true;
  }
  if (!Number.isInteger(max)) {
    console.error(`the max(${max}) is not integer.`);
    return true;
  }
  if (index < min || index > max) {
    console.error(`the index(${index}) is out of range [${min},${max}].`);
    return true;
  }
  return false;
}
