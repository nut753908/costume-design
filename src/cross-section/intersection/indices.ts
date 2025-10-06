import type * as THREE from "three";

/**
 * Convert to the lists.
 *
 * @param attribute - The results of geometry.getIndex() or geometry.getAttribute(...).
 * @param itemSize - The lists[*] size.
 * @return  The lists.
 */
export function convertToLists(
  attribute: THREE.BufferAttribute,
  itemSize: 2 | 3
): number[][] {
  if (itemSize === 3) {
    const l = attribute.array.length / 3;
    const lists: number[][] = [...Array(l)].map(() => [0, 0, 0]);
    for (let i = 0, i3 = 0; i < l; i++, i3 = 3 * i) {
      for (let j = 0; j < 3; j++) {
        lists[i][j] = attribute.array[i3 + j];
      }
    }
    return lists;
  } else if (itemSize === 2) {
    const l = attribute.array.length / 2;
    const lists: number[][] = [...Array(l)].map(() => [0, 0]);
    for (let i = 0, i2 = 0; i < l; i++, i2 = 2 * i) {
      for (let j = 0; j < 2; j++) {
        lists[i][j] = attribute.array[i2 + j];
      }
    }
    return lists;
  }
  return [];
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

/**
 * Create the vertex-indices map.
 *
 * @param nPolygonIndices - The n polygon indices.
 * @return  The vertex-indices map. The key is a string of one vertex.
 */
export function createVertexIndicesMap(nPolygonIndices: number[][]): {
  [k: string]: number[][];
} {
  const map: { [k: string]: number[][] } = {};
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const k = list[i];
      if (k in map) {
        map[k].push(list);
      } else {
        map[k] = [list];
      }
    }
  });
  return map;
}

/**
 * Create the edge-indices map.
 *
 * @param nPolygonIndices - The n polygon indices.
 * @return  The edge-indices map. The key is a string of two vertices.
 */
export function createEdgeIndicesMap(nPolygonIndices: number[][]): {
  [k: string]: number[][];
} {
  const map: { [k: string]: number[][] } = {};
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i + 1 < l ? list[i + 1] : list[0];
      [`${a},${b}`, `${b},${a}`].forEach((k) => {
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
