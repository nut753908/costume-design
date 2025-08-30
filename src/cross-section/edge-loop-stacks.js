import * as THREE from "three";

import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createRemainingVerticesMap, getDE, getAB } from "./vertices.js";
import { createAllEdgeLoops, createEdgeLoopMap } from "./edge-loops.js";

// TODO: handle mirror cases
// TODO: handle opened cases (start and end in the same position)
/**
 * Create all non-overlapping edge loop stacks.
 *
 * @param {THREE.BufferAttribute} indices - The indices of the geometry.
 * @returns {Array<EdgeLoopStack>} All non-overlapping edge loop stacks.
 */
export function createAllEdgeLoopStacks(indices) {
  const stacks = []; // edgeLoopStacks
  const allEls = createAllEdgeLoops(indices);
  const elMap = createEdgeLoopMap(allEls);
  const remainingVerticesMap = createRemainingVerticesMap(indices);
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
      const { d, e } = getDE(remainingVerticesMap, v1, v2);
      el = elMap[`${d},${e}`];
      if (!el.closed) break;
      if (firstVertexPairs.includes(`${d},${e}`)) {
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
      const { a, b } = getAB(remainingVerticesMap, v1, v2);
      el = elMap[`${a},${b}`];
      if (!el.closed) break;
      el.checked = true;
      vertices.unshift(el.vertices);
    }
    const stack = new EdgeLoopStack(vertices, !opened);
    stacks.push(stack);
  }
  return stacks;
}
