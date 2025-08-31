import * as THREE from "three";

import { Edge } from "./edge.js";
import { getPoint } from "./vertices.js";

/**
 * Find the diagonals.
 *
 * @param {Array<Edge>} allEdges - All non-overlapping edges.
 * @param {{[k:string]:Array<number>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {THREE.BufferAttribute} vertices - The results of geometry.getAttribute("position").
 * @returns {Array<Edge>} The diagonals.
 */
export function findDiagonals(allEdges, map, vertices) {
  return allEdges.filter((e) => {
    const rvs = map[`${e.v1},${e.v2}`];
    if (rvs.length !== 2) return false;
    const a = getPoint(vertices, e.v1);
    const b = getPoint(vertices, e.v2);
    const c = getPoint(vertices, rvs[0]);
    const d = getPoint(vertices, rvs[1]);
    b.sub(a);
    c.sub(a);
    d.sub(a);
    return Math.abs(b.dot(c.cross(d))) < 1e-10;
  });
}

/**
 * Create all non-overlapping edges.
 *
 * @param {THREE.BufferAttribute} indices - The results of geometry.getIndex().
 * @returns {Array<Edge>} All non-overlapping edges.
 */
export function createAllEdges(indices) {
  const set = new Set();
  for (let i = 0, l = indices.count; i < l; i += 3) {
    const a = indices.array[i];
    const b = indices.array[i + 1];
    const c = indices.array[i + 2];
    set.add(a < b ? `${a},${b}` : `${b},${a}`);
    set.add(b < c ? `${b},${c}` : `${c},${b}`);
    set.add(c < a ? `${c},${a}` : `${a},${c}`);
  }
  return set
    .values()
    .map((s) => s.split(","))
    .map(([a, b]) => new Edge(Number(a), Number(b)))
    .toArray();
}

/**
 * Create the edge map.
 *
 * @param {Array<Edge>} edges - Edges of the geometry.
 * @returns {{[k:string]:Edge}} The edge map. The key is a string of pairs v1, v2.
 */
export function createEdgeMap(edges) {
  const map = {};
  edges.forEach((e) => {
    map[`${e.v1},${e.v2}`] = e;
    map[`${e.v2},${e.v1}`] = e;
  });
  return map;
}
