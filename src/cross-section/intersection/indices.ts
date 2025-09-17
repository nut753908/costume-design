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

/**
 * Create the indices map.
 *
 * @param nPolygonIndices - The n polygon indices.
 * @return  The indices map. The key is a string of one or two vertices.
 */
export function createIndicesMap(nPolygonIndices: number[][]): {
  [k: string]: number[][];
} {
  const map: { [k: string]: number[][] } = {};
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i + 1 < l ? list[i + 1] : list[0];
      [`${a}`, `${a},${b}`, `${b},${a}`].forEach((k) => {
        if (k in map) {
          map[k].push(list);
        } else {
          map[k] = [list];
        }
      });
    }
  });
  return map;
}
