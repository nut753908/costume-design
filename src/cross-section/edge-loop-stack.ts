import * as THREE from "three";

import { getPoint } from "./points";

/**
 * An edge loop stack of geometry.
 *
 * ```js
 * import { EdgeLoopStack } from "./src/cross-section/edge-loop-stack";
 * const edgeLoopStack = new EdgeLoopStack( [ [ 0, 1, 2 ], [ 3, 4, 5 ] ], false );
 * ```
 */
export class EdgeLoopStack {
  /**
   * The vertices within an edge loop stack.
   */
  vertices: number[][];

  /**
   * Whether the edge loop stack is closed.
   */
  closed: boolean;

  /**
   * Constructs a new edge loop stack.
   *
   * @param vertices - {@link EdgeLoopStack#vertices}
   * @param closed - {@link EdgeLoopStack#closed}
   */
  constructor(vertices: number[][] = [], closed = false) {
    this.vertices = vertices;
    this.closed = closed;
  }

  /**
   * Get the points.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The points.
   */
  getPoints(positions: THREE.BufferAttribute): THREE.Vector3[][] {
    return this.vertices.map((list) => list.map((v) => getPoint(positions, v)));
  }

  /**
   * Returns a new edge loop stack with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): EdgeLoopStack {
    return new EdgeLoopStack().copy(this);
  }

  /**
   * Copies the values of the given edge loop stack to this instance.
   *
   * @param source - The edge loop stack to copy.
   * @return  A reference to this edge loop stack.
   */
  copy(source: EdgeLoopStack): this {
    this.vertices = source.vertices.map((list) => Array.from(list));
    this.closed = source.closed;

    return this;
  }

  /**
   * Serializes the edge loop stack into JSON.
   *
   * @return  A JSON object representing the serialized edge loop stack.
   */
  toJSON(): EdgeLoopStackJSON {
    return {
      vertices: this.vertices.map((list) => Array.from(list)),
      closed: this.closed,
    };
  }

  /**
   * Deserializes the edge loop stack from the given JSON.
   *
   * @param json - The JSON holding the serialized edge loop stack.
   * @return  A reference to this edge loop stack.
   */
  fromJSON(json: EdgeLoopStackJSON): this {
    this.vertices = json.vertices.map((list) => Array.from(list));
    this.closed = json.closed;

    return this;
  }
}

/**
 * The {@link EdgeLoopStack} JSON interface.
 */
export interface EdgeLoopStackJSON {
  /** {@link EdgeLoopStack#vertices} */
  vertices: number[][];
  /** {@link EdgeLoopStack#closed} */
  closed: boolean;
}
