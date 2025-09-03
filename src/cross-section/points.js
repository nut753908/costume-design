import * as THREE from "three";

/**
 * Get the point.
 *
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {number} index - The index of the vertex.
 * @returns {THREE.Vector3} The point.
 */
export function getPoint(positions, index) {
  return new THREE.Vector3(
    positions.array[3 * index],
    positions.array[3 * index + 1],
    positions.array[3 * index + 2]
  );
}
