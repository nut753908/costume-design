import * as THREE from "three";

import { getPoint } from "./points";

/**
 * An edge loop of geometry.
 *
 * ```js
 * import { EdgeLoop } from "./src/cross-section/edge-loop";
 * const edgeLoop = new EdgeLoop( [ 0, 1, 2 ], true );
 * ```
 */
export class EdgeLoop {
  /**
   * The vertices within an edge loop.
   */
  vertices: number[];

  /**
   * Whether the edge loop is closed.
   */
  closed: boolean;

  /**
   * Constructs a new edge loop.
   *
   * @param vertices - {@link EdgeLoop#vertices}
   * @param closed - {@link EdgeLoop#closed}
   */
  constructor(vertices: number[] = [], closed = false) {
    this.vertices = vertices;
    this.closed = closed;
  }

  /**
   * Get the points.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The points.
   */
  getPoints(positions: THREE.BufferAttribute): THREE.Vector3[] {
    return this.vertices.map((v) => getPoint(positions, v));
  }

  /**
   * Returns a new edge loop with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): EdgeLoop {
    return new EdgeLoop().copy(this);
  }

  /**
   * Copies the values of the given edge loop to this instance.
   *
   * @param source - The edge loop to copy.
   * @return  A reference to this edge loop.
   */
  copy(source: EdgeLoop): this {
    this.vertices = Array.from(source.vertices);
    this.closed = source.closed;

    return this;
  }

  /**
   * Serializes the edge loop into JSON.
   *
   * @return  A JSON object representing the serialized edge loop.
   */
  toJSON(): EdgeLoopJSON {
    return {
      vertices: Array.from(this.vertices),
      closed: this.closed,
    };
  }

  /**
   * Deserializes the edge loop from the given JSON.
   *
   * @param json - The JSON holding the serialized edge loop.
   * @return  A reference to this edge loop.
   */
  fromJSON(json: EdgeLoopJSON): this {
    this.vertices = Array.from(json.vertices);
    this.closed = json.closed;

    return this;
  }
}

/**
 * The {@link EdgeLoop} JSON interface.
 */
export interface EdgeLoopJSON {
  /** {@link EdgeLoop#vertices} */
  vertices: number[];
  /** {@link EdgeLoop#closed} */
  closed: boolean;
}
