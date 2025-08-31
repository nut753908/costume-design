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
    const v1 = getPoint(vertices, e.v1);
    const v2 = getPoint(vertices, rvs[0]);
    const v3 = getPoint(vertices, e.v2);
    const v4 = getPoint(vertices, rvs[1]);

    let error = 0;
    {
      const n1 = new THREE.Vector3();
      const n2 = new THREE.Vector3();
      const e21 = v1.clone().sub(v2);
      const e32 = v2.clone().sub(v3);
      const e31 = v1.clone().sub(v3);
      const e43 = v3.clone().sub(v4);
      const e14 = v4.clone().sub(v1);
      n1.crossVectors(e21, e32).normalize();
      n2.crossVectors(e31, e43).normalize();
      const angleA = Math.acos(n1.dot(n2));
      n1.crossVectors(e32, e43).normalize();
      n2.crossVectors(e14, e21).normalize();
      const angleB = Math.acos(n1.dot(n2));
      const diff = (angleA + angleB) / (Math.PI * 2);
      error += diff;
    }
    {
      const M_PI_2 = Math.PI / 2;
      const e21 = v1.clone().sub(v2).normalize();
      const e32 = v2.clone().sub(v3).normalize();
      const e43 = v3.clone().sub(v4).normalize();
      const e14 = v4.clone().sub(v1).normalize();
      const diff =
        (Math.abs(Math.acos(e21.dot(e32)) - M_PI_2) +
          Math.abs(Math.acos(e32.dot(e43)) - M_PI_2) +
          Math.abs(Math.acos(e43.dot(e14)) - M_PI_2) +
          Math.abs(Math.acos(e14.dot(e21)) - M_PI_2)) /
        (Math.PI * 2);
      error += diff;
    }
    {
      const n1 = new THREE.Vector3();
      const n2 = new THREE.Vector3();
      const e21 = v1.clone().sub(v2);
      const e32 = v2.clone().sub(v3);
      const e31 = v1.clone().sub(v3);
      const e43 = v3.clone().sub(v4);
      const e14 = v4.clone().sub(v1);
      const areaA =
        n1.crossVectors(e21, e32).length() / 2 +
        n2.crossVectors(e31, e43).length() / 2;
      const areaB =
        n1.crossVectors(e32, e43).length() / 2 +
        n2.crossVectors(e14, e21).length() / 2;
      const areaMin = Math.min(areaA, areaB);
      const areaMax = Math.max(areaA, areaB);
      const diff = areaMax ? 1 - areaMin / areaMax : 1;
      error += diff;
    }
    console.log(error);
    return error < 0.25;
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
