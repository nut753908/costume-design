import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createRemainingVerticesMap, getCs, getAs } from "./vertices.js";
import { createAllEdgeLoops, createEdgeLoopMap } from "./edge-loops.js";

// FIXME: fix inifinite loop
// TODO: add the top and bottom edge loops
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
    let count = 0; // debug code
    while (true) {
      const v1 = el.vertices[0];
      const v2 = el.vertices[1];
      const vs = getCs(remainingVerticesMap, v1, v2);
      if (vs === null) break;
      el = elMap[`${vs[0]},${vs[1]}`];
      if (!el.closed) break;
      if (firstVertexPairs.includes(`${vs[0]},${vs[1]}`)) {
        opened = false;
        break;
      }
      el.checked = true;
      vertices.push(el.vertices);
      // start the debug code
      count++;
      if (count > 100) {
        console.log("first loop: count > 100");
        break;
      }
      // end the debug code
    }
    el = firstEl;
    count = 0; // debug code
    while (opened) {
      const v1 = el.vertices[0];
      const v2 = el.vertices[1];
      const vs = getAs(remainingVerticesMap, v1, v2);
      if (vs === null) break;
      el = elMap[`${vs[0]},${vs[1]}`];
      if (!el.closed) break;
      if (firstVertexPairs.includes(`${vs[0]},${vs[1]}`)) {
        opened = false;
        break;
      }
      el.checked = true;
      vertices.unshift(el.vertices);
      // start the debug code
      count++;
      if (count > 100) {
        console.log("second loop: count > 100");
        break;
      }
      // end the debug code
    }
    const stack = new EdgeLoopStack(vertices, !opened);
    stacks.push(stack);
  }
  return stacks;
}
