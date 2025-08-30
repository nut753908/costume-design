import * as THREE from "three";

import { getPoint } from "./vertices.js";

/**
 * An edge of geometry.
 *
 * ```js
 * import { Edge } from "./src/cross-section/edge.js";
 * const edge = new Edge( 0, 1 );
 * ```
 */
export class Edge {
  /**
   * Constructs a new edge.
   *
   * @param {number} v1 - The index of the first vertex of the edge.
   * @param {number} v2 - The index of the second vertex of the edge.
   * @param {boolean} checked - Whether the edge is checked within the edge loop.
   */
  constructor(v1 = -1, v2 = -1, checked = false) {
    /**
     * The index of the first vertex of the edge.
     *
     * @type {number}
     */
    this.v1 = v1;

    /**
     * The index of the second vertex of the edge.
     *
     * @type {number}
     */
    this.v2 = v2;

    /**
     * Whether the edge is checked within the edge loop.
     *
     * @type {boolean}
     */
    this.checked = checked;
  }

  /**
   * Get the points.
   *
   * @param {THREE.BufferAttribute} vertices - The valid results of geometry.getAttribute("position").
   * @returns {Array<THREE.Vector3>} The points.
   */
  getPoints(vertices) {
    return [getPoint(vertices, this.v1), getPoint(vertices, this.v2)];
  }

  /**
   * Returns a new edge with copied values from this instance.
   *
   * @return {Edge} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given edge to this instance.
   *
   * @param {Edge} source - The edge to copy.
   * @returns {Edge} A reference to this edge.
   */
  copy(source) {
    this.v1 = source.v1;
    this.v2 = source.v2;
    this.checked = source.checked;

    return this;
  }

  /**
   * Serializes the edge into JSON.
   *
   * @return {Object} A JSON object representing the serialized edge.
   */
  toJSON() {
    const data = {};

    data.v1 = this.v1;
    data.v2 = this.v2;
    data.checked = this.checked;

    return data;
  }

  /**
   * Deserializes the edge from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized edge.
   * @return {Edge} A reference to this edge.
   */
  fromJSON(json) {
    this.v1 = json.v1;
    this.v2 = json.v2;
    this.checked = json.checked;

    return this;
  }
}
