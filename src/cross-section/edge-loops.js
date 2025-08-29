import * as THREE from "three";

import { EdgeLoop } from "./edge-loop.js";
import { Edges } from "./edges.js";

/**
 * Edge loops of geometry.
 *
 * ```js
 * import { EdgeLoops } from "./src/cross-section/edge-loops.js";
 * const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32, 8, true );
 * const el = new EdgeLoops( geometry );
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

    // Set all non-overlapping edge loops from the geometry.
    const indices = geometry.getIndex();
    if (!indices) return;
    const allEdges = new Edges(geometry).edges;
    const edgeMap = allEdges.reduce(
      (map, e) => ({ ...map, [`${e.v1},${e.v2}`]: e, [`${e.v2},${e.v1}`]: e }),
      {}
    );
    for (let i = 0, l = allEdges.length; i < l; i++) {
      const edges = [];

      let edge = allEdges[i];
      if (edge.checked) continue;
      edge.checked = true;
      edges.push(edge);

      const firstV1 = edge.v1;
      const firstV2 = edge.v2;
      let v1;
      let v2;

      v1 = firstV1;
      v2 = firstV2;
      while (true) {
        const v3 = this.findNextVertex(indices, v1, v2);
        if (!v3) break;
        v1 = v2;
        v2 = v3;

        edge = edgeMap[`${v1},${v2}`];
        if (!edge) break; // error
        edge.checked = true;
        edges.push(edge);

        if (v3 === firstV1) break;
      }

      v1 = firstV1;
      v2 = firstV2;
      while (true) {
        const v0 = this.findNextVertex(indices, v2, v1);
        if (!v0) break;
        v2 = v1;
        v1 = v0;

        edge = edgeMap[`${v1},${v2}`];
        if (!edge) break; // error
        edge.checked = true;
        edges.push(edge);

        if (v0 === firstV2) break;
      }

      const edgeLoop = new EdgeLoop(edges, false);
      this.edgeLoops.push(edgeLoop);
    }
  }

  findNextVertex(indices, v1, v2) {
    const vs0 = this.findRemainingVertices(indices, v1, v2);
    if (vs0.length !== 2) return null;

    const a = vs0[0];
    const vs1 = this.findRemainingVertices(indices, a, v2);
    if (vs1.length !== 2) return null;
    const b = vs1[vs1[0] === v1 ? 1 : 0];
    const vs2 = this.findRemainingVertices(indices, b, v2);
    if (vs2.length !== 2) return null;
    const c = vs2[vs2[0] === a ? 1 : 0];

    const d = vs0[1];
    const vs3 = this.findRemainingVertices(indices, d, v2);
    if (vs3.length !== 2) return null;
    const e = vs3[vs3[0] === v1 ? 1 : 0];
    const vs4 = this.findRemainingVertices(indices, e, v2);
    if (vs4.length !== 2) return null;
    const f = vs4[vs4[0] === d ? 1 : 0];

    if (c !== f) return null;
    return c;
  }

  findRemainingVertices(indices, v1, v2) {
    const vertices = [];
    for (let i = 0, l = indices.count; i < l; i += 3) {
      const a = indices.array[i];
      const b = indices.array[i + 1];
      const c = indices.array[i + 2];
      if ((a === v1 && b === v2) || (a === v2 && b === v1)) {
        vertices.push(c);
      } else if ((b === v1 && c === v2) || (b === v2 && c === v1)) {
        vertices.push(a);
      } else if ((c === v1 && a === v2) || (c === v2 && a === v1)) {
        vertices.push(b);
      }
    }
    if (vertices.length !== 1 && vertices.length !== 2) {
      console.error(`\
vertices.length !== 1 && vertices.length !== 2
- vertices:${JSON.stringify(vertices)}
- indices:${JSON.stringify(indices)}
- v1:${v1}
- v2:${v2}`);
    }
    return vertices;
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
