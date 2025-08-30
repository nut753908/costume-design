import * as THREE from "three";

/**
 * Create the remaining vertices map.
 *
 * @param {THREE.BufferAttribute} indices - The indices of the geometry.
 * @returns {{[k:string]:Array<number>}} The remaining vertices map. The key is a string of two vertices.
 */
export function createRemainingVerticesMap(indices) {
  const map = {};
  for (let i = 0, l = indices.count; i < l; i += 3) {
    const a = indices.array[i];
    const b = indices.array[i + 1];
    const c = indices.array[i + 2];
    Object.entries({
      [`${a},${b}`]: c,
      [`${b},${a}`]: c,
      [`${b},${c}`]: a,
      [`${c},${b}`]: a,
      [`${c},${a}`]: b,
      [`${a},${c}`]: b,
    }).forEach(([k, v]) => {
      k in map ? map[k].push(v) : (map[k] = [v]);
    });
  }
  return map;
}

/**
 * Find the next vertex in the direction v1 -> v2.
 *
 * @param {{[k:string]:Array<number>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {number} v1 - The index of the first vertex of the edge.
 * @param {number} v2 - The index of the second vertex of the edge.
 * @returns {number} The next vertex.
 */
export function findNextVertex(map, v1, v2) {
  const vs0 = map[`${v1},${v2}`];
  if (vs0.length !== 2) return null;

  const a = vs0[0];
  const vs1 = map[`${a},${v2}`];
  if (vs1.length !== 2) return null;
  const b = vs1[vs1[0] === v1 ? 1 : 0];
  const vs2 = map[`${b},${v2}`];
  if (vs2.length !== 2) return null;
  const c = vs2[vs2[0] === a ? 1 : 0];

  const d = vs0[1];
  const vs3 = map[`${d},${v2}`];
  if (vs3.length !== 2) return null;
  const e = vs3[vs3[0] === v1 ? 1 : 0];
  const vs4 = map[`${e},${v2}`];
  if (vs4.length !== 2) return null;
  const f = vs4[vs4[0] === d ? 1 : 0];

  if (c !== f) return null;
  return c;
}

/**
 * Gets the vertices to pass through when searching for the next vertex in the v1 -> v2 direction.
 *
 * @param {{[k:string]:Array<number>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {number} v1 - The index of the first vertex of the edge.
 * @param {number} v2 - The index of the second vertex of the edge.
 * @returns {{a:number,b:number,d:number,e:number}} The index of each vertex.
 */
export function getVertices(map, v1, v2) {
  const vs0 = map[`${v1},${v2}`];
  if (vs0.length !== 2) return {};

  const a = vs0[0];
  const vs1 = map[`${a},${v2}`];
  if (vs1.length !== 2) return {};
  const b = vs1[vs1[0] === v1 ? 1 : 0];

  const d = vs0[1];
  const vs3 = map[`${d},${v2}`];
  if (vs3.length !== 2) return {};
  const e = vs3[vs3[0] === v1 ? 1 : 0];

  return { a, b, d, e };
}
