import { EdgeLoop } from "./edge-loop.js";

/**
 * An edge loop stack of geometry.
 *
 * ```js
 * import { Edge } from "./src/cross-section/edge.js";
 * import { EdgeLoop } from "./src/cross-section/edge-loop.js";
 * import { EdgeLoopStack } from "./src/cross-section/edge-loop-stack.js";
 * const edges1 = [
 *   new Edge( 0, 1, true ),
 *   new Edge( 1, 2, true ),
 *   new Edge( 0, 2, true )
 * ];
 * const edges2 = [
 *   new Edge( 3, 4, true ),
 *   new Edge( 4, 5, true ),
 *   new Edge( 3, 5, true )
 * ]
 * const edgeLoops = [
 *   new EdgeLoop( edges1, true ),
 *   new EdgeLoop( edges2, true )
 * ];
 * const edgeLoopStack = new EdgeLoopStack( edgeLoops );
 * ```
 */
export class EdgeLoopStack {
  /**
   * Constructs a new edge loop stack.
   *
   * @param {Array<EdgeLoop>} edgeLoops - The edge loops within an edge loop stack.
   */
  constructor(edgeLoops = []) {
    /**
     * The edge loops within an edge loop.
     *
     * @type {Array<EdgeLoop>}
     */
    this.edgeLoops = edgeLoops;
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

    return this;
  }
}
