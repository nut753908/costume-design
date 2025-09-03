import * as THREE from "three";

/**
 * Create a line path.
 *
 * @param {Array<THREE.Vector3>} points
 * @returns {THREE.CurvePath} A line path.
 */
export function createLinePath(points) {
  const linePath = new THREE.CurvePath();
  for (let i = 0, l = points.length - 1; i < l; i++) {
    const line = new THREE.LineCurve3(points[i], points[i + 1]);
    linePath.add(line);
  }
  return linePath;
}
