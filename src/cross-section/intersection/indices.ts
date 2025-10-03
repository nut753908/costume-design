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
  const lists: number[][] = [];
  if (itemSize === 3) {
    for (let i = 0, l = attribute.array.length; i < l; i += 3) {
      lists.push([
        attribute.array[i],
        attribute.array[i + 1],
        attribute.array[i + 2],
      ]);
    }
  } else if (itemSize === 2) {
    for (let i = 0, l = attribute.array.length; i < l; i += 2) {
      lists.push([attribute.array[i], attribute.array[i + 1]]);
    }
  }
  return lists;
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
