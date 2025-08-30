import * as THREE from "three";

import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createRemainingVerticesMap, getAB, getDE } from "./vertices.js";
import {
  createAllEdgeLoops,
  createEdgeLoopMap,
  createEdgeLoopVertexPairs,
} from "./edge-loops.js";

// TODO: handle mirror cases
// TODO: handle opened cases (start and end in the same position)
/**
 * Create all non-overlapping edge loop stacks.
 *
 * @param {THREE.BufferAttribute} indices - The indices of the geometry.
 * @returns {Array<EdgeLoopStack>} All non-overlapping edge loop stacks.
 */
export function createAllEdgeLoopStacks(indices) {
  const edgeLoopStacks = [];
  const allEdgeLoops = createAllEdgeLoops(indices);
  const edgeLoopMap = createEdgeLoopMap(allEdgeLoops);
  const remainingVerticesMap = createRemainingVerticesMap(indices);
  for (let i = 0, l = allEdgeLoops.length; i < l; i++) {
    const edgeLoops = [];
    let edgeLoop = allEdgeLoops[i];
    if (!edgeLoop.closed) continue;
    if (edgeLoop.index !== Number.MAX_SAFE_INTEGER) continue;
    edgeLoop.index = 0;
    edgeLoops.push(edgeLoop);
    const firstEdgeLoop = edgeLoop;
    const firstVertexPairs = createEdgeLoopVertexPairs(firstEdgeLoop);
    let index = 0;
    let opened = true;
    while (true) {
      const v1 = edgeLoop.vertices[0];
      const v2 = edgeLoop.vertices[1];
      const { a, b } = getAB(remainingVerticesMap, v1, v2);
      edgeLoop = edgeLoopMap[`${a},${b}`];
      if (!edgeLoop.closed) break;
      if (firstVertexPairs.includes(`${a},${b}`)) {
        opened = false;
        break;
      }
      edgeLoop.index = ++index;
      edgeLoops.push(edgeLoop);
    }
    edgeLoop = firstEdgeLoop;
    index = 0;
    while (opened) {
      const v1 = edgeLoop.vertices[0];
      const v2 = edgeLoop.vertices[1];
      const { d, e } = getDE(remainingVerticesMap, v1, v2);
      edgeLoop = edgeLoopMap[`${d},${e}`];
      if (!edgeLoop.closed) break;
      edgeLoop.index = --index;
      edgeLoops.unshift(edgeLoop);
    }
    const edgeLoopStack = new EdgeLoopStack(edgeLoops, !opened);
    edgeLoopStacks.push(edgeLoopStack);
  }
  return edgeLoopStacks;
}
