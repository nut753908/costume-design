import { getPoint } from "src/cross-section/centerline/points";
import * as THREE from "three";
import { Intersection, type IntersectionJSON } from "./intersection";
import { VertexIntersection } from "./vertex-intersection";

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
   * The index of the back vertex of the edge.
   */
  backV: number;

  /**
   * The index of the front vertex of the edge.
   */
  frontV: number;

  /**
   * The edge intersection position from backV to frontV. Must be in the range [0, 1].
   */
  u: number;

  /**
   * Constructs a new edge intersection.
   *
   * @param backV - {@link EdgeIntersection#backV}
   * @param frontV - {@link EdgeIntersection#frontV}
   * @param u - {@link EdgeIntersection#u}
   * @param checked - {@link Intersection#checked}
   */
  constructor(backV = -1, frontV = -1, u = 0, checked = false) {
    super(checked);
    this.type = "EdgeIntersection";
    this.backV = backV;
    this.frontV = frontV;
    this.u = u;
  }

  /**
   * Get the point.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The point.
   */
  getPoint(positions: THREE.BufferAttribute): THREE.Vector3 {
    const back = getPoint(positions, this.backV);
    const front = getPoint(positions, this.frontV);
    const diff = front.clone().sub(back);
    return back.clone().add(diff.multiplyScalar(this.u));
  }

  /**
   * Get the normal on the point.
   *
   * @param normals - The results of geometry.getAttribute("normal").
   * @return  The normal on the point.
   */
  getNormal(normals: THREE.BufferAttribute): THREE.Vector3 {
    return this.getPoint(normals).normalize();
  }

  /**
   * Get the uv on the point.
   *
   * @param uvs - The results of geometry.getAttribute("uv").
   * @return  The uv on the point.
   */
  getUv(uvs: THREE.BufferAttribute): THREE.Vector2 {
    const back = new THREE.Vector2(
      uvs.array[2 * this.backV],
      uvs.array[2 * this.backV + 1]
    );
    const front = new THREE.Vector2(
      uvs.array[2 * this.frontV],
      uvs.array[2 * this.frontV + 1]
    );
    const diff = front.clone().sub(back);
    return back.clone().add(diff.multiplyScalar(this.u));
  }

  /**
   * Return `true` if this edge intersection is equal with the given one.
   *
   * @param i - The edge intersection to test for equality.
   * @return  Whether this edge intersection is equal with the given one.
   */
  equals(i: Intersection): boolean {
    if (!(i instanceof EdgeIntersection)) return false;
    return i.backV === this.backV && i.frontV === this.frontV;
  }

  /**
   * Whether one intersection has the other intersection.
   */
  has(i: Intersection): boolean {
    if (!(i instanceof VertexIntersection)) return false;
    return i.v === this.backV || i.v === this.frontV;
  }

  /**
   * Return a string representing this edge intersection.
   */
  toString(): string {
    return `${this.backV},${this.frontV}`;
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
    this.backV = source.backV;
    this.frontV = source.frontV;
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
      type: this.type,
      backV: this.backV,
      frontV: this.frontV,
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
    this.backV = json.backV;
    this.frontV = json.frontV;
    this.u = json.u;
    this.checked = json.checked;

    return this;
  }
}

/**
 * The {@link EdgeIntersection} JSON interface.
 */
export interface EdgeIntersectionJSON extends IntersectionJSON {
  /** {@link EdgeIntersection#backV} */
  backV: number;
  /** {@link EdgeIntersection#frontV} */
  frontV: number;
  /** {@link EdgeIntersection#u} */
  u: number;
}
