import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createAllEdgeLoops, createEdgeLoopsMap } from "./edge-loops.js";
import { createRemainingVerticesMap } from "./vertices.js";
import { Edge } from "./edge.js";
import { findNextEdge } from "./edges.js";

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
  const elsMap = createEdgeLoopsMap(allEls);
  for (let i = 0, l = allEls.length; i < l; i++) {
    let el = allEls[i]; // edgeLoop
    if (!el.closed) continue;
    if (el.checked) continue;
    el.checked = true;
    const vertices = [el.vertices];
    // note: use el.vertices[2]/[3] so that the index/middle finger do not connect.
    const firstE = new Edge(el.vertices[2], el.vertices[3]); // firstEdge
    let secondE = null; // secondEdge
    let opened = true;
    for (let n = 0; n < 2; n++) {
      let e1 = secondE; // edge1
      let e2 = firstE; // edge2
      while (opened) {
        const e3 = findNextEdge(remainingVerticesMap, e1, e2); // edge3
        if (e3 === null) break;
        if (secondE === null) secondE = e3;
        e1 = e2;
        e2 = e3;
        const els = elsMap[`${e3.v1},${e3.v2}`];
        if (els === undefined) break;
        el = null;
        for (let j = 0, l2 = els.length; j < l2; j++) {
          if (!els[j].closed) continue;
          if (vertices[0].length !== els[j].vertices.length) continue;
          el = els[j];
        }
        if (el === null) break;
        el.checked = true;
        if (e3.equals(firstE)) {
          opened = false;
          break;
        }
        if (n === 0) vertices.push(el.vertices);
        if (n === 1) vertices.unshift(el.vertices);
      }
    }
    const stack = new EdgeLoopStack(vertices, !opened);
    stacks.push(stack);
  }
  return stacks;
}
