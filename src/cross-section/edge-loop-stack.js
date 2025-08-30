import * as THREE from "three";

import { getPoint } from "./vertices.js";

/**
 * An edge loop stack of geometry.
 *
 * ```js
 * import { EdgeLoopStack } from "./src/cross-section/edge-loop-stack.js";
 * const edgeLoopStack = new EdgeLoopStack( [ [ 0, 1, 2 ], [ 3, 4, 5 ] ], false );
 * ```
 */
export class EdgeLoopStack {
  /**
   * Constructs a new edge loop stack.
   *
   * @param {Array<Array<number>>} vertices - The vertices within an edge loop stack.
   * @param {boolean} closed - Whether the edge loop stack is closed.
   */
  constructor(vertices = [], closed = false) {
    /**
     * The vertices within an edge loop.
     *
     * @type {Array<Array<number>>}
     */
    this.vertices = vertices;

    /**
     * Whether the edge loop stack is closed.
     *
     * @type {boolean}
     */
    this.closed = closed;
  }

  /**
   * Get the points.
   *
   * @param {THREE.BufferAttribute} vertices - The valid results of geometry.getAttribute("position").
   * @returns {Array<THREE.Vector3>} The points.
   */
  getPoints(vertices) {
    return this.vertices.flat().map((v) => getPoint(vertices, v));
  }

  /**
   * Returns a new edge loop stack with copied values from this instance.
   *
   * @return {EdgeLoopStack} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given edge loop stack to this instance.
   *
   * @param {EdgeLoopStack} source - The edge loop stack to copy.
   * @returns {EdgeLoopStack} A reference to this edge loop stack.
   */
  copy(source) {
    this.vertices = source.vertices.map((vs) => Array.from(vs));
    this.closed = source.closed;

    return this;
  }

  /**
   * Serializes the edge loop stack into JSON.
   *
   * @return {Object} A JSON object representing the serialized edge loop stack.
   */
  toJSON() {
    const data = {};

    data.vertices = this.vertices.map((vs) => Array.from(vs));
    data.closed = this.closed;

    return data;
  }

  /**
   * Deserializes the edge loop stack from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized edge loop stack.
   * @return {EdgeLoopStack} A reference to this edge loop stack.
   */
  fromJSON(json) {
    this.vertices = json.vertices.map((vs) => Array.from(vs));
    this.closed = json.closed;

    return this;
  }
}
