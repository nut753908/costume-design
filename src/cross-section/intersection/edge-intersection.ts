import { getPoint } from "src/cross-section/centerline/points";
import type * as THREE from "three";
import { Intersection } from "./intersection";

/**
 * An edge intersection with a plane.
 *
 * ```js
 * import { EdgeIntersection } from "./src/cross-section/intersection/edge-intersection";
 * const edgeIntersection = new EdgeIntersection( 0, 1, 0 );
 * ```
 *
 * @augments Intersection
 */
export class EdgeIntersection extends Intersection {
  /**
   * The index of the bottom vertex of the edge.
   */
  bottomV: number;

  /**
   * The index of the top vertex of the edge.
   */
  topV: number;

  /**
   * The edge intersection position from bottomV to topV. Must be in the range [0, 1].
   */
  u: number;

  /**
   * Whether the edge intersection is checked when finding intersections.
   */
  checked: boolean;

  /**
   * Constructs a new edge intersection.
   *
   * @param bottomV - {@link EdgeIntersection#bottomV}
   * @param topV - {@link EdgeIntersection#topV}
   * @param u - {@link EdgeIntersection#u}
   * @param checked - {@link EdgeIntersection#checked}
   */
  constructor(bottomV = -1, topV = -1, u = 0, checked = false) {
    super();
    this.bottomV = bottomV;
    this.topV = topV;
    this.u = u;
    this.checked = checked;
  }

  /**
   * Get the point.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The point.
   */
  getPoint(positions: THREE.BufferAttribute): THREE.Vector3 {
    const bottom = getPoint(positions, this.bottomV);
    const top = getPoint(positions, this.topV);
    const diff = top.clone().sub(bottom);
    return bottom.clone().add(diff.multiplyScalar(this.u));
  }

  /**
   * Return `true` if this edge intersection is equal with the given one.
   *
   * @param ei - The edge intersection to test for equality.
   * @return  Whether this edge intersection is equal with the given one.
   */
  equals(ei: EdgeIntersection): boolean {
    return ei.bottomV === this.bottomV && ei.topV === this.topV;
  }

  /**
   * Return a string representing this edge intersection.
   */
  toString(): string {
    return `${this.bottomV},${this.topV}`;
  }

  /**
   * Returns a new edge intersection with copied values from this instance.
   *
   * @return {EdgeIntersection} A clone of this instance.
   */
  clone(): EdgeIntersection {
    return new EdgeIntersection().copy(this);
  }

  /**
   * Copies the values of the given edge intersection to this instance.
   *
   * @param source - The edge intersection to copy.
   * @return  A reference to this edge intersection.
   */
  copy(source: EdgeIntersection): this {
    this.bottomV = source.bottomV;
    this.topV = source.topV;
    this.u = source.u;
    this.checked = source.checked;

    return this;
  }

  /**
   * Serializes the edge intersection into JSON.
   *
   * @return  A JSON object representing the serialized edge intersection.
   */
  toJSON(): EdgeIntersectionJSON {
    return {
      bottomV: this.bottomV,
      topV: this.topV,
      u: this.u,
      checked: this.checked,
    };
  }

  /**
   * Deserializes the edge intersection from the given JSON.
   *
   * @param json - The JSON holding the serialized edge intersection.
   * @return  A reference to this edge intersection.
   */
  fromJSON(json: EdgeIntersectionJSON): this {
    this.bottomV = json.bottomV;
    this.topV = json.topV;
    this.u = json.u;
    this.checked = json.checked;

    return this;
  }
}

/**
 * The {@link EdgeIntersection} JSON interface.
 */
export interface EdgeIntersectionJSON {
  /** {@link EdgeIntersection#bottomV} */
  bottomV: number;
  /** {@link EdgeIntersection#topV} */
  topV: number;
  /** {@link EdgeIntersection#u} */
  u: number;
  /** {@link EdgeIntersection#checked} */
  checked: boolean;
}
