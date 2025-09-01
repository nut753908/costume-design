import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createAllEdgeLoops, createEdgeLoopMap } from "./edge-loops.js";
import { createRemainingVerticesMap } from "./vertices.js";
import { Edge } from "./edge.js";
import { findNextEdge } from "./edges.js";

// TODO: add the top and bottom edge loops
/**
 * Create all non-overlapping edge loop stacks.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<EdgeLoopStack>} All non-overlapping edge loop stacks.
 */
export function createAllEdgeLoopStacks(nPolygonIndices) {
  const stacks = []; // edgeLoopStacks
  const allEls = createAllEdgeLoops(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const elMap = createEdgeLoopMap(allEls);
  for (let i = 0, l = allEls.length; i < l; i++) {
    const vertices = [];
    let el = allEls[i]; // edgeLoop
    if (!el.closed) continue;
    if (el.checked) continue;
    el.checked = true;
    vertices.push(el.vertices);
    const firstE = new Edge(el.vertices[0], el.vertices[1]); // firstEdge
    let secondE = null; // secondEdge
    let opened = true;
    for (let i = 0; i < 2; i++) {
      let e1 = secondE; // edge1
      let e2 = firstE; // edge2
      while (opened) {
        const e3 = findNextEdge(remainingVerticesMap, e1, e2); // edge3
        if (e3 === null) break;
        if (secondE === null) secondE = e3;
        e1 = e2;
        e2 = e3;
        el = elMap[`${e3.v1},${e3.v2}`];
        if (!el.closed) break;
        if (e3.equals(firstE)) {
          opened = false;
          break;
        }
        el.checked = true;
        if (i === 0) vertices.push(el.vertices);
        if (i === 1) vertices.unshift(el.vertices);
      }
    }
    const stack = new EdgeLoopStack(vertices, !opened);
    stacks.push(stack);
  }
  return stacks;
}
