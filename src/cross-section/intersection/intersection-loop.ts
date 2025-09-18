import * as THREE from "three";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";
import {
  EdgeIntersection,
  type EdgeIntersectionJSON,
} from "./edge-intersection";
import {
  VertexIntersection,
  type VertexIntersectionJSON,
} from "./vertex-intersection";

/**
 * An intersection loop.
 *
 * ```js
 * import { IntersectionLoop } from "./src/cross-section/intersection/intersection-loop";
 * const intersections = [
 *   new EdgeIntersection( 1, 3, 0.5, true ),
 *   new EdgeIntersection( 0, 3, 0.75, true ),
 *   new VertexIntersection( 2, true ),
 * ];
 * const intersectionLoop = new IntersectionLoop( intersections, true );
 * ```
 */
export class IntersectionLoop {
  /**
   * The vertices within an edge loop.
   */
  intersections: (EdgeIntersection | VertexIntersection)[];

  /**
   * Whether the intersection loop is closed.
   */
  closed: boolean;

  /**
   * Constructs a new intersection loop.
   *
   * @param intersections - {@link IntersectionLoop#intersections}
   * @param closed - {@link IntersectionLoop#closed}
   */
  constructor(
    intersections: (EdgeIntersection | VertexIntersection)[] = [],
    closed = false
  ) {
    this.intersections = intersections;
    this.closed = closed;
  }

  /**
   * Get the vertex indices as the bottom vertex of each edges.
   * Duplicate indices are removed and made unique.
   */
  get bottomVs(): number[] {
    return [...new Set(this.intersections.map((i) => i.bottomV))];
  }

  /**
   * Get the vertex indices as the top vertex of each edges.
   * Duplicate indices are removed and made unique.
   */
  get topVs(): number[] {
    return [...new Set(this.intersections.map((i) => i.topV))];
  }

  /**
   * Get the points.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @return  The points.
   */
  getPoints(positions: THREE.BufferAttribute): THREE.Vector3[] {
    return this.intersections.map((i) => i.getPoint(positions));
  }

  /**
   * Get whether the reference point of the plane is inside the intersection loop.
   *
   * @param positions - The results of geometry.getAttribute("position").
   */
  inLoop(
    plane: FreePlane | VerticalPlane,
    positions: THREE.BufferAttribute
  ): boolean {
    if (!this.closed) return false;
    const top = plane.getTopNormal();
    const points = this.getPoints(positions);
    const c = plane.getPoint();
    let anyVector = new THREE.Vector3(1, 0, 0);
    if (top.equals(anyVector) || top.equals(anyVector.clone().negate()))
      anyVector = new THREE.Vector3(0, 0, 1);
    const cd = anyVector.clone().cross(top);
    let count = 0;
    for (let i = 0, l = points.length; i < l; i++) {
      // console.log(`i: ${i}`);
      const a = points[i];
      const b = i + 1 < l ? points[i + 1] : points[0];
      const ac = c.clone().sub(a);
      const ab = b.clone().sub(a);
      const v0 = ac;
      const v1 = ab;
      const v2 = cd;
      const cross12 = v1.clone().cross(v2).dot(top);
      if (cross12 === 0) continue;
      const cross01 = v0.clone().cross(v1).dot(top);
      const cross02 = v0.clone().cross(v2).dot(top);
      const t2 = cross01 / cross12;
      const t1 = cross02 / cross12;
      // console.log(`t1: ${t1}`);
      // console.log(`t2: ${t2}`);
      // console.log(`cross12: ${cross12}`);
      if (t2 >= 0) {
        if (t1 > 0 && t1 < 1) count += 1;
        if (cross12 > 0 && t1 === 0) count += 1; // for top
        if (cross12 < 0 && t1 === 1) count += 1; // for top
      }
    }
    // console.log(`count: ${count}`);
    // console.log();
    return count % 2 === 1;
  }

  /**
   * Returns a new edge loop with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): IntersectionLoop {
    return new IntersectionLoop().copy(this);
  }

  /**
   * Copies the values of the given edge loop to this instance.
   *
   * @param source - The edge loop to copy.
   * @return  A reference to this edge loop.
   */
  copy(source: IntersectionLoop): this {
    this.intersections = source.intersections.map((i) => i.clone());
    this.closed = source.closed;

    return this;
  }

  /**
   * Serializes the edge loop into JSON.
   *
   * @return  A JSON object representing the serialized edge loop.
   */
  toJSON(): IntersectionLoopJSON {
    return {
      intersections: this.intersections.map((i) => i.toJSON()),
      closed: this.closed,
    };
  }

  /**
   * Deserializes the edge loop from the given JSON.
   *
   * @param json - The JSON holding the serialized edge loop.
   * @return  A reference to this edge loop.
   */
  fromJSON(json: IntersectionLoopJSON): this {
    this.intersections = json.intersections.map((i) => {
      if (i.type === "EdgeIntersection") {
        return new EdgeIntersection().fromJSON(i as EdgeIntersectionJSON);
      } else if (i.type === "VertexIntersection") {
        return new VertexIntersection().fromJSON(i as VertexIntersectionJSON);
      } else {
        console.error(`\
!(i.type === "EdgeIntersection") && !(i.type === "VertexIntersection")
- i: ${JSON.stringify(i)}
`);
        return new EdgeIntersection();
      }
    });
    this.closed = json.closed;

    return this;
  }
}

/**
 * The {@link IntersectionLoop} JSON interface.
 */
export interface IntersectionLoopJSON {
  /** {@link IntersectionLoop#intersections} */
  intersections: (EdgeIntersectionJSON | VertexIntersectionJSON)[];
  /** {@link IntersectionLoop#closed} */
  closed: boolean;
}
