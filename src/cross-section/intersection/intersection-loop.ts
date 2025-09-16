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
 *   new EdgeIntersection( 0, 3, 0.5, true ),
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
- i.type: ${JSON.stringify(i.type)}
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
