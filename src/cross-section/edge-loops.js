import * as THREE from "three";

import { EdgeLoop } from "./edge-loop.js";
import { Edge } from "./edge.js";

/**
 * Edge loops of geometry.
 *
 * ```js
 * import { EdgeLoops } from "./src/cross-section/edge-loops.js";
 * const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32, 8, true );
 * const edgeLoops = new EdgeLoops( geometry );
 * ```
 */
export class EdgeLoops {
  /**
   * Constructs new edge loops.
   *
   * @param {THREE.BufferGeometry} geometry - The geometry.
   */
  constructor(geometry = new THREE.BufferGeometry()) {
    /**
     * Edge loops of the geometry.
     *
     * @type {Array<EdgeLoop>}
     */
    this.edgeLoops = [];

    const indices = geometry.getIndex();
    if (!indices) return;
    this.edgeLoops = this.createAllEdgeLoops(indices);
  }

  /**
   * Create all non-overlapping edge loops.
   *
   * @param {THREE.BufferAttribute} indices - The indices of the geometry.
   * @returns {Array<EdgeLoop>} All non-overlapping edge loops.
   */
  createAllEdgeLoops(indices) {
    const edgeLoops = [];
    const allEdges = this.createAllEdges(indices);
    const remainingVerticesMap = this.createRemainingVerticesMap(indices);
    const edgeMap = this.createEdgeMap(allEdges);
    for (let i = 0, l = allEdges.length; i < l; i++) {
      const edges = [];
      let edge = allEdges[i];
      if (edge.index !== Number.MAX_SAFE_INTEGER) continue;
      edge.index = 0;
      edges.push(edge);
      const firstV1 = edge.v1;
      const firstV2 = edge.v2;
      let v1 = firstV1;
      let v2 = firstV2;
      let index = 0;
      while (true) {
        const v3 = this.findNextVertex(remainingVerticesMap, v1, v2);
        if (v3 === null) break;
        v1 = v2;
        v2 = v3;
        edge = edgeMap[`${v1},${v2}`];
        edge.index = ++index;
        edges.push(edge);
        if (v3 === firstV1) break;
      }
      v1 = firstV1;
      v2 = firstV2;
      index = 0;
      while (true) {
        const v0 = this.findNextVertex(remainingVerticesMap, v2, v1);
        if (v0 === null) break;
        v2 = v1;
        v1 = v0;
        edge = edgeMap[`${v1},${v2}`];
        edge.index = --index;
        edges.push(edge);
        if (v0 === firstV2) break;
      }
      // edges.sort((a, b) =>
      //   a.index < b.index ? -1 : a.index > b.index ? 1 : 0
      // );
      const edgeLoop = new EdgeLoop(edges);
      edgeLoops.push(edgeLoop);
    }
    return edgeLoops;
  }

  /**
   * Create all non-overlapping edges.
   *
   * @param {THREE.BufferAttribute} indices - The indices of the geometry.
   * @returns {Array<Edge>} All non-overlapping edges.
   */
  createAllEdges(indices) {
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
   * Create the remaining vertices map.
   *
   * @param {THREE.BufferAttribute} indices - The indices of the geometry.
   * @returns {{[k:string]:Array<number>}} The remaining vertices map. The key is a string of two vertices.
   */
  createRemainingVerticesMap(indices) {
    const map = {};
    for (let i = 0, l = indices.count; i < l; i += 3) {
      const a = indices.array[i];
      const b = indices.array[i + 1];
      const c = indices.array[i + 2];
      Object.entries({
        [`${a},${b}`]: c,
        [`${b},${a}`]: c,
        [`${b},${c}`]: a,
        [`${c},${b}`]: a,
        [`${c},${a}`]: b,
        [`${a},${c}`]: b,
      }).forEach(([k, v]) => {
        k in map ? map[k].push(v) : (map[k] = [v]);
      });
    }
    return map;
  }

  /**
   * Create the edge map.
   *
   * @param {Array<Edge>} edges - Edges of the geometry.
   * @returns {{[k:string]:Edge}} The edge map. The key is a string of pairs v1, v2.
   */
  createEdgeMap(edges) {
    const map = {};
    edges.forEach((e) => {
      map[`${e.v1},${e.v2}`] = e;
      map[`${e.v2},${e.v1}`] = e;
    });
    return map;
  }

  /**
   * Find the next vertex in the direction v1 -> v2.
   *
   * @param {{[k:string]:Array<number>}} map - The remaining vertices map. The key is a string of two vertices.
   * @param {number} v1 - The index of the first vertex of the edge.
   * @param {number} v2 - The index of the second vertex of the edge.
   * @returns {number} The next vertex.
   */
  findNextVertex(map, v1, v2) {
    const vs0 = map[`${v1},${v2}`];
    if (vs0.length !== 2) return null;

    const a = vs0[0];
    const vs1 = map[`${a},${v2}`];
    if (vs1.length !== 2) return null;
    const b = vs1[vs1[0] === v1 ? 1 : 0];
    const vs2 = map[`${b},${v2}`];
    if (vs2.length !== 2) return null;
    const c = vs2[vs2[0] === a ? 1 : 0];

    const d = vs0[1];
    const vs3 = map[`${d},${v2}`];
    if (vs3.length !== 2) return null;
    const e = vs3[vs3[0] === v1 ? 1 : 0];
    const vs4 = map[`${e},${v2}`];
    if (vs4.length !== 2) return null;
    const f = vs4[vs4[0] === d ? 1 : 0];

    if (c !== f) return null;
    return c;
  }

  /**
   * Returns new edge loops with copied values from this instance.
   *
   * @return {EdgeLoops} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given edge loops to this instance.
   *
   * @param {EdgeLoops} source - The edge loops to copy.
   * @returns {EdgeLoops} A reference to these edge loops.
   */
  copy(source) {
    this.edgeLoops = [];

    for (let i = 0, l = source.edgeLoops.length; i < l; i++) {
      const edgeLoop = source.edgeLoops[i];
      this.edgeLoops.push(edgeLoop.clone());
    }

    return this;
  }

  /**
   * Serializes the edge loops into JSON.
   *
   * @return {Object} A JSON object representing the serialized edge loops.
   */
  toJSON() {
    const data = {};

    data.edgeLoops = [];

    for (let i = 0, l = this.edgeLoops.length; i < l; i++) {
      const edgeLoop = this.edgeLoops[i];
      data.edgeLoops.push(edgeLoop.toJSON());
    }

    return data;
  }

  /**
   * Deserializes the edge loops from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized edge loops.
   * @return {EdgeLoops} A reference to these edge loops.
   */
  fromJSON(json) {
    this.edgeLoops = [];

    for (let i = 0, l = json.edgeLoops.length; i < l; i++) {
      const edgeLoop = json.edgeLoops[i];
      this.edgeLoops.push(new EdgeLoop().fromJSON(edgeLoop));
    }

    return this;
  }
}
