// TODO: test constructor(), clone(), copy(), toJSON(), fromJSON()

import { Edge } from "./edge.js";

/**
 * An edge loop of geometry.
 *
 * ```js
 * import { Edge } from "./src/cross-section/edge.js";
 * import { EdgeLoop } from "./src/cross-section/edge-loop.js";
 * const edges = [
 *   new Edge( 0, 1, true ),
 *   new Edge( 1, 2, true ),
 *   new Edge( 0, 2, true )
 * ];
 * const el = new EdgeLoop( edges, false );
 * ```
 */
export class EdgeLoop {
  /**
   * Constructs a new edge loop.
   *
   * @param {Array<Edge>} edges - The edges within an edge loop.
   * @param {boolean} checked - Whether the edge loop stack calculation is checked.
   */
  constructor(edges = [], checked = false) {
    /**
     * The edges within an edge loop.
     *
     * @type {Array<Edge>}
     */
    this.edges = edges;

    /**
     * Whether the edge loop calculation is checked.
     *
     * @type {boolean}
     */
    this.checked = checked;
  }

  /**
   * Returns a new edge loop with copied values from this instance.
   *
   * @return {EdgeLoop} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given edge loop to this instance.
   *
   * @param {EdgeLoop} source - The edge loop to copy.
   * @returns {EdgeLoop} A reference to this edge loop.
   */
  copy(source) {
    this.edges = [];
    for (let i = 0, l = source.edges.length; i < l; i++) {
      const edge = source.edges[i];
      this.edges.push(edge.clone());
    }
    this.checked = source.checked;

    return this;
  }

  /**
   * Serializes the edge loop into JSON.
   *
   * @return {Object} A JSON object representing the serialized edge loop.
   */
  toJSON() {
    const data = {};

    data.edges = [];
    for (let i = 0, l = this.edges.length; i < l; i++) {
      const edge = this.edges[i];
      data.edges.push(edge.toJSON());
    }
    data.checked = this.checked;

    return data;
  }

  /**
   * Deserializes the edge loop from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized edge loop.
   * @return {EdgeLoop} A reference to this edge loop.
   */
  fromJSON(json) {
    this.edges = [];
    for (let i = 0, l = json.edges.length; i < l; i++) {
      const edge = json.edges[i];
      this.edges.push(new Edge().fromJSON(edge));
    }
    this.checked = json.checked;

    return this;
  }
}
