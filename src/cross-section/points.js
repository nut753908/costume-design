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

/**
 * Get the centroids.
 *
 * @param {Array<Array<THREE.Vector3>>} points - The points within an edge loop stack.
 * @returns {Array<THREE.Vector3>} The centroids.
 */
export function getCentroids(points) {
  return points.map((list) => getCentroid(list));
}

/**
 * Get the centroid.
 *
 * @param {Array<THREE.Vector3>} points - The points within an edge loop.
 * @returns {THREE.Vector3} The centroid.
 */
function getCentroid(points) {
  const centroid = new THREE.Vector3(0, 0, 0);
  points.forEach((p) => centroid.add(p));
  centroid.subScalar(points.length);
  return centroid;
}
