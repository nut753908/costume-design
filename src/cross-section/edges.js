import { Edge } from "./edge.js";

/**
 * Create all non-overlapping edges.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<Edge>} All non-overlapping edges.
 */
export function createAllEdges(nPolygonIndices) {
  const edges = [];
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i + 1 < l ? list[i + 1] : list[0];
      const ab = `${a},${b}`;
      const ba = `${b},${a}`;
      if (!edges.includes(ab) && !edges.includes(ba)) edges.push(ab);
    }
  });
  return edges
    .map((s) => s.split(","))
    .map(([a, b]) => new Edge(Number(a), Number(b)));
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

/**
 * Find the next edge in the direction e1 -> e2.
 *
 * @param {{[k:string]:Array<Array<number>>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {?Edge} e1 - The first edge.
 * @param {?Edge} e2 - The second edge.
 * @returns {?Edge} The next edge.
 */
export function findNextEdge(map, e1, e2) {
  if (e2 === null) {
    console.error("e2 === null");
    return null;
  }
  const vs0 = map[`${e2.v1},${e2.v2}`];
  if (vs0.length !== 2) return null;
  if (vs0[0].length !== 2) return null;
  if (vs0[1].length !== 2) return null;

  const e3_0 = new Edge(vs0[0][0], vs0[0][1]);
  const e3_1 = new Edge(vs0[1][0], vs0[1][1]);
  if (e1 === null) return e3_0;
  if (e3_0.equals(e1)) return e3_1;
  if (e3_1.equals(e1)) return e3_0;
  console.error(`\
!(e1 === null) && !e3_0.equals(e1) && !e3_1.equals(e1)
- e1: ${JSON.stringify(e1)}
- e2: ${JSON.stringify(e2)}
- e3_0: ${JSON.stringify(e3_0)}
- e3_1: ${JSON.stringify(e3_1)}
`);
  return null;
}
