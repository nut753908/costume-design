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
  const strings = []; // [JSON.stringify(stack.vertices.toSorted()) for stack in stacks]
  const allEls = createAllEdgeLoops(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const elsMap = createEdgeLoopsMap(allEls);
  for (let i = 0, l = allEls.length; i < l; i++) {
    const el = allEls[i]; // edgeLoop
    if (!el.closed) continue;
    for (let j = 0, l2 = el.vertices.length; j < l2; j++) {
      const vertices = [el.vertices];
      const strings2 = [JSON.stringify(el.vertices.toSorted())]; // [JSON.stringify(el.vertices.toSorted()) for el in els]
      const firstE = new Edge(
        el.vertices[j],
        el.vertices[j !== l2 - 1 ? j + 1 : 0]
      ); // firstEdge
      let secondE = null; // secondEdge
      let opened = true;
      for (let n = 0; n < 2; n++) {
        let e1 = secondE; // edge1
        let e2 = firstE; // edge2
        while (opened) {
          const e3 = findNextEdge(remainingVerticesMap, e1, e2); // edge3
          if (e3 === null) break;
          if (secondE === null) secondE = e3;
          if (e3.equals(firstE)) {
            opened = false;
            break;
          }
          e1 = e2;
          e2 = e3;
          const els = elsMap[`${e3.v1},${e3.v2}`];
          if (els === undefined) break;
          const el2 = els.find(
            (v) => v.closed && el.vertices.length === v.vertices.length
          );
          if (el2 === undefined) break;
          const s = JSON.stringify(el2.vertices.toSorted());
          if (strings2.includes(s)) continue;
          strings2.push(s);
          if (n === 0) vertices.push(el2.vertices);
          if (n === 1) vertices.unshift(el2.vertices);
        }
      }
      if (vertices.length === 1) continue;
      const s = JSON.stringify(vertices.toSorted());
      if (strings.includes(s)) continue;
      strings.push(s);
      const stack = new EdgeLoopStack(vertices, !opened);
      stacks.push(stack);
    }
  }
  return stacks;
}
