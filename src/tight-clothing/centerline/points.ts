import * as THREE from "three";

/**
 * Get the point.
 *
 * @param positions - The results of geometry.getAttribute("position").
 * @param index - The index of the vertex.
 * @return  The point.
 */
export function getPoint(
  positions: THREE.Float32BufferAttribute,
  index: number
): THREE.Vector3 {
  const i = 3 * index;
  return new THREE.Vector3(
    positions.array[i],
    positions.array[i + 1],
    positions.array[i + 2]
  );
}

/**
 * Get the centroids.
 *
 * @param points - The points within an edge loop stack.
 * @return  The centroids.
 */
export function getCentroids(points: THREE.Vector3[][]): THREE.Vector3[] {
  return points.map((list) => getCentroid(list));
}

/**
 * Get the centroid.
 *
 * @param points - The points within an edge loop or an intersection loop.
 * @return  The centroid.
 */
export function getCentroid(points: THREE.Vector3[]): THREE.Vector3 {
  const centroid = new THREE.Vector3(0, 0, 0);
  points.map((p) => centroid.add(p));
  centroid.divideScalar(points.length);
  return centroid;
}
