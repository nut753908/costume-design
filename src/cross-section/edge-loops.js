import * as THREE from "three";

import { EdgeLoop } from "./edge-loop.js";
import { createRemainingVerticesMap, findNextVertex } from "./vertices.js";
import { createAllEdges, createEdgeMap } from "./edges.js";

/**
 * Create all non-overlapping edge loops.
 *
 * @param {THREE.BufferAttribute} indices - The valid results of geometry.getIndex().
 * @returns {Array<EdgeLoop>} All non-overlapping edge loops.
 */
export function createAllEdgeLoops(indices) {
  const els = []; // egdeLoops
  const allEdges = createAllEdges(indices);
  const remainingVerticesMap = createRemainingVerticesMap(indices);
  const edgeMap = createEdgeMap(allEdges);
  for (let i = 0, l = allEdges.length; i < l; i++) {
    const vertices = [];
    let edge = allEdges[i];
    if (edge.checked) continue;
    edge.checked = true;
    vertices.push(edge.v1, edge.v2);
    const firstV1 = edge.v1;
    const firstV2 = edge.v2;
    let v1 = firstV1;
    let v2 = firstV2;
    let opened = true;
    while (true) {
      const v3 = findNextVertex(remainingVerticesMap, v1, v2);
      if (v3 === null) break;
      v1 = v2;
      v2 = v3;
      edge = edgeMap[`${v1},${v2}`];
      edge.checked = true;
      if (v3 === firstV1) {
        opened = false;
        break;
      }
      vertices.push(v3);
    }
    v1 = firstV1;
    v2 = firstV2;
    while (opened) {
      const v0 = findNextVertex(remainingVerticesMap, v2, v1);
      if (v0 === null) break;
      v2 = v1;
      v1 = v0;
      edge = edgeMap[`${v1},${v2}`];
      edge.checked = true;
      if (v0 === firstV2) {
        opened = false;
        break;
      }
      vertices.unshift(v0);
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
