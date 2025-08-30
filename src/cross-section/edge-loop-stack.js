import { EdgeLoop } from "./edge-loop.js";

/**
 * An edge loop stack of geometry.
 *
 * ```js
 * import { EdgeLoop } from "./src/cross-section/edge-loop.js";
 * import { EdgeLoopStack } from "./src/cross-section/edge-loop-stack.js";
 * const edgeLoops = [
 *   new EdgeLoop( [ 0, 1, 2 ], true, true ),
 *   new EdgeLoop( [ 3, 4, 5 ], true, true )
 * ];
 * const edgeLoopStack = new EdgeLoopStack( edgeLoops, false );
 * ```
 */
export class EdgeLoopStack {
  /**
   * Constructs a new edge loop stack.
   *
   * @param {Array<EdgeLoop>} edgeLoops - The edge loops within an edge loop stack.
   * @param {boolean} closed - Whether the edge loop is closed.
   */
  constructor(edgeLoops = [], closed = false) {
    /**
     * The edge loops within an edge loop.
     *
     * @type {Array<EdgeLoop>}
     */
    this.edgeLoops = edgeLoops;

    /**
     * Whether the edge loop is closed.
     *
     * @type {boolean}
     */
    this.closed = closed;
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
    this.edgeLoops = [];
    for (let i = 0, l = source.edgeLoops.length; i < l; i++) {
      const edgeLoop = source.edgeLoops[i];
      this.edgeLoops.push(edgeLoop.clone());
    }
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

    data.edgeLoops = [];
    for (let i = 0, l = this.edgeLoops.length; i < l; i++) {
      const edgeLoop = this.edgeLoops[i];
      data.edgeLoops.push(edgeLoop.toJSON());
    }
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
    this.edgeLoops = [];
    for (let i = 0, l = json.edgeLoops.length; i < l; i++) {
      const edgeLoop = json.edgeLoops[i];
      this.edgeLoops.push(new EdgeLoop().fromJSON(edgeLoop));
    }
    this.closed = json.closed;

    return this;
  }
}
