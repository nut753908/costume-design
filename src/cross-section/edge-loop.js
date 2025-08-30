import { Edge } from "./edge.js";

/**
 * An edge loop of geometry.
 *
 * ```js
 * import { Edge } from "./src/cross-section/edge.js";
 * import { EdgeLoop } from "./src/cross-section/edge-loop.js";
 * const edges = [
 *   new Edge( 0, 1, 0 ),
 *   new Edge( 1, 2, 1 ),
 *   new Edge( 0, 2, 2 )
 * ];
 * const edgeLoop = new EdgeLoop( edges, true );
 * ```
 */
export class EdgeLoop {
  /**
   * Constructs a new edge loop.
   *
   * @param {Array<Edge>} edges - The edges within an edge loop.
   * @param {boolean} closed - Whether the edge loop is closed.
   * @param {number} index - The index within the edge loop stack.
   */
  constructor(edges = [], closed = false, index = Number.MAX_SAFE_INTEGER) {
    /**
     * The edges within an edge loop.
     *
     * @type {Array<Edge>}
     */
    this.edges = edges;

    /**
     * Whether the edge loop is closed.
     *
     * @type {boolean}
     */
    this.closed = closed;

    /**
     * The index within the edge loop stack.
     *
     * @type {number}
     */
    this.index = index;
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
    this.closed = source.closed;
    this.index = source.index;

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
    data.closed = this.closed;
    data.index = this.index;

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
    this.closed = json.closed;
    this.index = json.index;

    return this;
  }
}
