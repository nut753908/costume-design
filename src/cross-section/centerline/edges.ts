import { Edge } from "./edge";

/**
 * Create all non-overlapping edges.
 *
 * @param nPolygonIndices - The n polygon indices.
 * @return  All non-overlapping edges.
 */
export function createAllEdges(nPolygonIndices: number[][]): Edge[] {
  const edges = new Set<string>();
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i + 1 < l ? list[i + 1] : list[0];
      const ab = `${a},${b}`;
      const ba = `${b},${a}`;
      if (!edges.has(ab) && !edges.has(ba)) edges.add(ab);
    }
  });
  return [...edges]
    .map((s) => s.split(","))
    .map(([a, b]) => new Edge(Number(a), Number(b)));
}

/**
 * Create the edge map.
 *
 * @param edges - Edges of the geometry.
 * @return  The edge map. The key is a string of pairs v1, v2.
 */
export function createEdgeMap(edges: Edge[]): { [k: string]: Edge } {
  const map: { [k: string]: Edge } = {};
  edges.forEach((e) => {
    map[`${e.v1},${e.v2}`] = e;
    map[`${e.v2},${e.v1}`] = e;
  });
  return map;
}

/**
 * Find the next edge in the direction e1 -> e2.
 *
 * @param map - The remaining vertices map. The key is a string of two vertices.
 * @param e1 - The first edge.
 * @param e2 - The second edge.
 * @return  The next edge.
 */
export function findNextEdge(
  map: { [k: string]: number[][] },
  e1: Edge | null,
  e2: Edge | null
): Edge | null {
  if (e2 === null) {
    console.error("e2 === null");
    return null;
  }
  const vs = map[`${e2.v1},${e2.v2}`];
  if (vs === undefined) return null;
  const e3_0 =
    vs.length >= 1 && vs[0].length === 2 ? new Edge(vs[0][0], vs[0][1]) : null;
  const e3_1 =
    vs.length >= 2 && vs[1].length === 2 ? new Edge(vs[1][0], vs[1][1]) : null;
  if (e1 !== null) {
    if (e3_0?.equals(e1)) return e3_1;
    if (e3_1?.equals(e1)) return e3_0;
  }
  if (e3_0 === null) return e3_1;
  if (e3_1 === null) return e3_0;
  return e3_0;
}
