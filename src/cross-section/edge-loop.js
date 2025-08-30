/**
 * An edge loop of geometry.
 *
 * ```js
 * import { EdgeLoop } from "./src/cross-section/edge-loop.js";
 * const edgeLoop = new EdgeLoop( [ 0, 1, 2 ], true );
 * ```
 */
export class EdgeLoop {
  /**
   * Constructs a new edge loop.
   *
   * @param {Array<number>} vertices - The vertices within an edge loop.
   * @param {boolean} closed - Whether the edge loop is closed.
   * @param {boolean} checked - Whether the edge loop is checked within the edge loop stack.
   */
  constructor(vertices = [], closed = false, checked = false) {
    /**
     * The vertices within an edge loop.
     *
     * @type {Array<number>}
     */
    this.vertices = vertices;

    /**
     * Whether the edge loop is closed.
     *
     * @type {boolean}
     */
    this.closed = closed;

    /**
     * Whether the edge loop is checked within the edge loop stack.
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
    this.vertices = Array.from(source.vertices);
    this.closed = source.closed;
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

    data.vertices = Array.from(this.vertices);
    data.closed = this.closed;
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
    this.vertices = Array.from(json.vertices);
    this.closed = json.closed;
    this.checked = json.checked;

    return this;
  }
}
