import type * as THREE from "three";

import { getPoint } from "./points";

/**
 * An edge of geometry.
 *
 * ```js
 * import { Edge } from "./src/cross-section/centerline/edge";
 * const edge = new Edge( 0, 1 );
 * ```
 */
export class Edge {
  /**
   * The index of the first vertex of the edge.
   */
  v1: number;

  /**
   * The index of the second vertex of the edge.
   */
  v2: number;

  /**
   * Whether the edge is checked within the edge loop.
   */
  checked: boolean;

  /**
   * Constructs a new edge.
   *
   * @param v1 - {@link Edge#v1}
   * @param v2 - {@link Edge#v2}
   * @param checked - {@link Edge#checked}
   */
  constructor(v1 = -1, v2 = -1, checked = false) {
    this.v1 = v1;
    this.v2 = v2;
    this.checked = checked;
  }

  /**
   * Get the points.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The points.
   */
  getPoints(
    positions: THREE.Float32BufferAttribute
  ): [THREE.Vector3, THREE.Vector3] {
    return [getPoint(positions, this.v1), getPoint(positions, this.v2)];
  }

  /**
   * Return `true` if this edge is equal with the given one.
   *
   * @param e - The edge to test for equality.
   * @return  Whether this edge is equal with the given one.
   */
  equals(e: Edge): boolean {
    return (
      (e.v1 === this.v1 && e.v2 === this.v2) ||
      (e.v1 === this.v2 && e.v2 === this.v1)
    );
  }

  /**
   * Returns a new edge with copied values from this instance.
   *
   * @return {Edge} A clone of this instance.
   */
  clone(): Edge {
    return new Edge().copy(this);
  }

  /**
   * Copies the values of the given edge to this instance.
   *
   * @param source - The edge to copy.
   * @return  A reference to this edge.
   */
  copy(source: Edge): this {
    this.v1 = source.v1;
    this.v2 = source.v2;
    this.checked = source.checked;

    return this;
  }

  /**
   * Serializes the edge into JSON.
   *
   * @return  A JSON object representing the serialized edge.
   */
  toJSON(): EdgeJSON {
    return {
      v1: this.v1,
      v2: this.v2,
      checked: this.checked,
    };
  }

  /**
   * Deserializes the edge from the given JSON.
   *
   * @param json - The JSON holding the serialized edge.
   * @return  A reference to this edge.
   */
  fromJSON(json: EdgeJSON): this {
    this.v1 = json.v1;
    this.v2 = json.v2;
    this.checked = json.checked;

    return this;
  }
}

/**
 * The {@link Edge} JSON interface.
 */
export interface EdgeJSON {
  /** {@link Edge#v1} */
  v1: number;
  /** {@link Edge#v2} */
  v2: number;
  /** {@link Edge#checked} */
  checked: boolean;
}
