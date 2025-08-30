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
   * @param {number} index - The index within the edge loop.
   */
  constructor(v1 = -1, v2 = -1, index = Number.MAX_SAFE_INTEGER) {
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
     * The index within the edge loop.
     *
     * @type {number}
     */
    this.index = index;
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
    this.index = source.index;

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
    data.index = this.index;

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
    this.index = json.index;

    return this;
  }
}
