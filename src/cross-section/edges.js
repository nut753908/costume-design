import { Edge } from "./edge.js";

/**
 * Create all non-overlapping edges.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<Edge>} All non-overlapping edges.
 */
export function createAllEdges(nPolygonIndices) {
  const set = new Set();
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i !== list.length - 1 ? list[i + 1] : list[0];
      set.add(a < b ? `${a},${b}` : `${b},${a}`);
    }
  });
  return set
    .values()
    .map((s) => s.split(","))
    .map(([a, b]) => new Edge(Number(a), Number(b)))
    .toArray();
}

/**
 * Create the edge map.
 *
 * @param {Array<Edge>} edges - Edges of the geometry.
 * @returns {{[k:string]:Edge}} The edge map. The key is a string of pairs v1, v2.
 */
export function createEdgeMap(edges) {
  const map = {};
  edges.forEach((e) => {
    map[`${e.v1},${e.v2}`] = e;
    map[`${e.v2},${e.v1}`] = e;
  });
  return map;
}
