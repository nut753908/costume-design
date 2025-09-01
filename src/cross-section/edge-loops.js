import { EdgeLoop } from "./edge-loop.js";
import { createRemainingVerticesMap, findNextVertex } from "./vertices.js";
import { createAllEdges, createEdgeMap } from "./edges.js";

/**
 * Create all non-overlapping edge loops.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<EdgeLoop>} All non-overlapping edge loops.
 */
export function createAllEdgeLoops(nPolygonIndices) {
  const els = []; // egdeLoops
  const allEdges = createAllEdges(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const edgeMap = createEdgeMap(allEdges);
  for (let i = 0, l = allEdges.length; i < l; i++) {
    const vertices = [];
    let edge = allEdges[i];
    if (edge.checked) continue;
    edge.checked = true;
    vertices.push(edge.v1, edge.v2);
    const firstV1 = edge.v1;
    const firstV2 = edge.v2;
    let opened = true;
    for (let n = 0; n < 2; n++) {
      let v1 = n === 0 ? firstV1 : firstV2;
      let v2 = n === 0 ? firstV2 : firstV1;
      const lastV = n === 0 ? firstV1 : firstV2;
      while (opened) {
        const v3 = findNextVertex(remainingVerticesMap, v1, v2);
        if (v3 === null) break;
        v1 = v2;
        v2 = v3;
        edge = edgeMap[`${v1},${v2}`];
        edge.checked = true;
        if (v3 === lastV) {
          opened = false;
          break;
        }
        if (n === 0) vertices.push(v3);
        if (n === 1) vertices.unshift(v3);
      }
    }
    const el = new EdgeLoop(vertices, !opened);
    els.push(el);
  }
  return els;
}

/**
 * Create the edge map.
 *
 * @param {Array<EdgeLoop>} els - Edge loops of the geometry.
 * @returns {{[k:string]:EdgeLoop}} The edge loop map. The key is a string of pairs v1, v2.
 */
export function createEdgeLoopMap(els) {
  const map = {};
  els.forEach((el) => {
    for (let i = 0, l = el.vertices.length - 1; i < l; i++) {
      const v1 = el.vertices[i];
      const v2 = el.vertices[i + 1];
      map[`${v1},${v2}`] = el;
      map[`${v2},${v1}`] = el;
    }
    if (el.closed) {
      const v1 = el.vertices[el.vertices.length - 1];
      const v2 = el.vertices[0];
      map[`${v1},${v2}`] = el;
      map[`${v2},${v1}`] = el;
    }
  });
  return map;
}
