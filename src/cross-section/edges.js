import * as THREE from "three";

import { Edge } from "./edge.js";

/**
 * Edges of geometry.
 *
 * ```js
 * import { Edges } from "./src/cross-section/edges.js";
 * const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32, 8, true );
 * const e = new Edges( geometry );
 * ```
 */
export class Edges {
  /**
   * Constructs new edges.
   *
   * @param {THREE.BufferGeometry} geometry - The geometry.
   */
  constructor(geometry = new THREE.BufferGeometry()) {
    /**
     * Edges of the geometry.
     *
     * @type {Array<Edge>}
     */
    this.edges = [];

    // Set all non-overlapping edges from the geometry.
    const indices = geometry.getIndex();
    if (!indices) return;
    const set = new Set();
    for (let i = 0, l = indices.count; i < l; i += 3) {
      const a = indices.array[i];
      const b = indices.array[i + 1];
      const c = indices.array[i + 2];
      set.add(a < b ? `${a},${b}` : `${b},${a}`);
      set.add(b < c ? `${b},${c}` : `${c},${b}`);
      set.add(c < a ? `${c},${a}` : `${a},${c}`);
    }
    this.edges = set
      .values()
      .map((s) => s.split(","))
      .map(([a, b]) => new Edge(Number(a), Number(b), false))
      .toArray();
  }

  /**
   * Returns new edges with copied values from this instance.
   *
   * @return {Edges} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given edges to this instance.
   *
   * @param {Edges} source - The edges to copy.
   * @returns {Edges} A reference to these edges.
   */
  copy(source) {
    this.edges = [];

    for (let i = 0, l = source.edges.length; i < l; i++) {
      const edge = source.edges[i];
      this.edges.push(edge.clone());
    }

    return this;
  }

  /**
   * Serializes the edges into JSON.
   *
   * @return {Object} A JSON object representing the serialized edges.
   */
  toJSON() {
    const data = {};

    data.edges = [];

    for (let i = 0, l = this.edges.length; i < l; i++) {
      const edge = this.edges[i];
      data.edges.push(edge.toJSON());
    }

    return data;
  }

  /**
   * Deserializes the edges from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized edges.
   * @return {Edges} A reference to these edges.
   */
  fromJSON(json) {
    this.edges = [];

    for (let i = 0, l = json.edges.length; i < l; i++) {
      const edge = json.edges[i];
      this.edges.push(new Edge().fromJSON(edge));
    }

    return this;
  }
}
