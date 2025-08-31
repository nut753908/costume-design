import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createRemainingVerticesMap, getCs, getAs } from "./vertices.js";
import { createAllEdgeLoops, createEdgeLoopMap } from "./edge-loops.js";

// TODO: handle mirror cases
// TODO: handle opened cases (start and end in the same position)
/**
 * Create all non-overlapping edge loop stacks.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<EdgeLoopStack>} All non-overlapping edge loop stacks.
 */
export function createAllEdgeLoopStacks(nPolygonIndices) {
  const stacks = []; // edgeLoopStacks
  const allEls = createAllEdgeLoops(nPolygonIndices);
  const elMap = createEdgeLoopMap(allEls);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  for (let i = 0, l = allEls.length; i < l; i++) {
    const vertices = [];
    let el = allEls[i]; // edgeLoop
    if (!el.closed) continue;
    if (el.checked) continue;
    el.checked = true;
    vertices.push(el.vertices);
    const firstEl = el;
    const firstVertexPairs = firstEl.createVertexPairs();
    let opened = true;
    while (true) {
      const v1 = el.vertices[0];
      const v2 = el.vertices[1];
      const cs = getCs(remainingVerticesMap, v1, v2);
      el = elMap[`${cs[0]},${cs[1]}`];
      if (!el.closed) break;
      if (firstVertexPairs.includes(`${cs[0]},${cs[1]}`)) {
        opened = false;
        break;
      }
      el.checked = true;
      vertices.push(el.vertices);
    }
    el = firstEl;
    while (opened) {
      const v1 = el.vertices[0];
      const v2 = el.vertices[1];
      const as = getAs(remainingVerticesMap, v1, v2);
      el = elMap[`${as[0]},${as[1]}`];
      if (!el.closed) break;
      if (firstVertexPairs.includes(`${as[0]},${as[1]}`)) {
        opened = false;
        break;
      }
      el.checked = true;
      vertices.unshift(el.vertices);
    }
    const stack = new EdgeLoopStack(vertices, !opened);
    stacks.push(stack);
  }
  return stacks;
}
