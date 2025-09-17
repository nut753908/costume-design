import { getPoint } from "src/cross-section/centerline/points";
import type * as THREE from "three";
import { EdgeIntersection } from "./edge-intersection";
import { Intersection, type IntersectionJSON } from "./intersection";

/**
 * An vertex intersection with a plane.
 *
 * ```js
 * import { VertexIntersection } from "./src/cross-section/intersection/vertex-intersection";
 * const vertexIntersection = new VertexIntersection( 0 );
 * ```
 *
 * @augments Intersection
 */
export class VertexIntersection extends Intersection {
  /**
   * The index of the vertex.
   */
  v: number;

  /**
   * Constructs a new vertex intersection.
   *
   * @param v - {@link VertexIntersection#v}
   * @param checked - {@link Intersection#checked}
   */
  constructor(v = -1, checked = false) {
    super(checked);
    this.type = "VertexIntersection";
    this.v = v;
  }

  /**
   * Get the point.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The point.
   */
  getPoint(positions: THREE.BufferAttribute): THREE.Vector3 {
    return getPoint(positions, this.v);
  }

  /**
   * Return `true` if this vertex intersection is equal with the given one.
   *
   * @param i - The vertex intersection to test for equality.
   * @return  Whether this vertex intersection is equal with the given one.
   */
  equals(i: Intersection): boolean {
    if (!(i instanceof VertexIntersection)) return false;
    return i.v === this.v;
  }

  /**
   * Whether one intersection has the other intersection.
   */
  has(i: Intersection): boolean {
    if (!(i instanceof EdgeIntersection)) return false;
    return i.bottomV === this.v || i.topV === this.v;
  }

  /**
   * Return a string representing this vertex intersection.
   */
  toString(): string {
    return `${this.v}`;
  }

  /**
   * Returns a new vertex intersection with copied values from this instance.
   *
   * @return {VertexIntersection} A clone of this instance.
   */
  clone(): VertexIntersection {
    return new VertexIntersection().copy(this);
  }

  /**
   * Copies the values of the given vertex intersection to this instance.
   *
   * @param source - The vertex intersection to copy.
   * @return  A reference to this vertex intersection.
   */
  copy(source: VertexIntersection): this {
    this.v = source.v;
    this.checked = source.checked;

    return this;
  }

  /**
   * Serializes the vertex intersection into JSON.
   *
   * @return  A JSON object representing the serialized vertex intersection.
   */
  toJSON(): VertexIntersectionJSON {
    return {
      type: this.type,
      v: this.v,
      checked: this.checked,
    };
  }

  /**
   * Deserializes the vertex intersection from the given JSON.
   *
   * @param json - The JSON holding the serialized vertex intersection.
   * @return  A reference to this vertex intersection.
   */
  fromJSON(json: VertexIntersectionJSON): this {
    this.v = json.v;
    this.checked = json.checked;

    return this;
  }
}

/**
 * The {@link VertexIntersection} JSON interface.
 */
export interface VertexIntersectionJSON extends IntersectionJSON {
  /** {@link VertexIntersection#v} */
  v: number;
}
