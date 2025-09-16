import type * as THREE from "three";

/**
 * Convert to the triangular polygon indices.
 *
 * @param indices - The results of geometry.getIndex().
 * @return  The triangular polygon indices.
 */
export function convertToTriangularPolygonIndices(
  indices: THREE.BufferAttribute
): [number, number, number][] {
  const triangularPolygonIndices: [number, number, number][] = [];
  for (let i = 0, l = indices.count; i < l; i += 3) {
    triangularPolygonIndices.push([
      indices.array[i],
      indices.array[i + 1],
      indices.array[i + 2],
    ]);
  }
  return triangularPolygonIndices;
}
