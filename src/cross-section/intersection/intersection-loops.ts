import type { EdgeIntersection } from "./edge-intersection";
import { createIndicesMap } from "./indices";
import {
  IntersectionLoop,
  type IntersectionLoopJSON,
} from "./intersection-loop";
import type { VertexIntersection } from "./vertex-intersection";

/**
 * Create all intersection loops with a plane.
 *
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 * @param allIntersections - All edge/vertex intersections with a plane.
 */
export function createAllIntersectionLoops(
  indicesMap: { [k: string]: number[][] },
  allIntersections: (EdgeIntersection | VertexIntersection)[]
): IntersectionLoop[] {
  const iLoops: IntersectionLoop[] = []; // intersectionLoops
  for (let i = 0, l = allIntersections.length; i < l; i++) {
    const firstI = allIntersections[i]; // firstIntersection
    if (firstI.checked) continue;
    firstI.checked = true;
    let secondI: EdgeIntersection | VertexIntersection | null = null; // secondIntersection
    const iLoop = [firstI]; // intersectionLoop
    let count = 0;
    let opened = true;
    for (let n = 0; n < 2; n++) {
      let i1 = secondI ?? firstI; // intersection1
      let i2 = firstI; // intersection2
      whileLoop: while (opened) {
        count += 1;
        if (count > 1000) {
          console.error("whileLoop: count > 1000");
          break;
        }
        const indicesMap2 = createIndicesMap(indicesMap[i2.toString()]);
        for (let j = 0; j < l; j++) {
          const i3 = allIntersections[j]; // intersection3
          if (!(i3.toString() in indicesMap2)) continue;
          if (i3.has(i2)) continue;
          if (i3.equals(i2)) continue;
          if (i3.equals(i1)) continue;
          if (i3.equals(firstI)) {
            opened = false;
            break whileLoop;
          }
          if (secondI === null) secondI = i3;
          i3.checked = true;
          if (n === 0) iLoop.push(i3);
          if (n === 1) iLoop.unshift(i3);
          i1 = i2;
          i2 = i3;
          continue whileLoop;
        }
        break;
      }
    }
    iLoops.push(new IntersectionLoop(iLoop, !opened));
  }
  return iLoops;
}

/**
 * All intersection loops with a plane.
 *
 * ```js
 * import { EdgeIntersection } from "./src/cross-section/intersection/edge-intersection";
 * import { VertexIntersection } from "./src/cross-section/intersection/vertex-intersection";
 * import { IntersectionLoop } from "./src/cross-section/intersection/intersection-loop";
 * import { IntersectionLoops } from "./src/cross-section/intersection/intersection-loops";
 * const intersections = [
 *   new EdgeIntersection( 1, 3, 0.5, true ),
 *   new EdgeIntersection( 0, 3, 0.75, true ),
 *   new VertexIntersection( 2, true ),
 * ];
 * const intersectionLoop = new IntersectionLoop( intersections, true );
 * const intersectionLoops = new IntersectionLoops( [ intersectionLoop ], "all", [] );
 * ```
 */
export class IntersectionLoops {
  /**
   * The intersection loops.
   */
  intersectionLoops: IntersectionLoop[];

  /**
   * The method for selecting intersection loops.
   */
  selection: "all" | "including plane" | "excluding plane" | "some";

  /**
   * The specified indices of the intersection loops.
   * This is only used if the selection is "some".
   */
  indices: number[];

  /**
   * Constructs a new intersection loops.
   *
   * @param intersectionLoops - {@link IntersectionLoops#intersectionLoops}
   * @param selection - {@link IntersectionLoops#selection}
   * @param indices - {@link IntersectionLoops#indices}
   */
  constructor(
    intersectionLoops: IntersectionLoop[] = [],
    selection: IntersectionLoops["selection"] = "all",
    indices: number[] = []
  ) {
    this.intersectionLoops = intersectionLoops;
    this.selection = selection;
    this.indices = indices;
  }

  /**
   * Returns a new intersection loops with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): IntersectionLoops {
    return new IntersectionLoops().copy(this);
  }

  /**
   * Copies the values of the given intersection loops to this instance.
   *
   * @param source - The intersection loops to copy.
   * @return  A reference to this intersection loops.
   */
  copy(source: IntersectionLoops): this {
    this.intersectionLoops = source.intersectionLoops.map((il) => il.clone());
    this.selection = source.selection;
    this.indices = source.indices;

    return this;
  }

  /**
   * Serializes the intersection loops into JSON.
   *
   * @return  A JSON object representing the serialized intersection loops.
   */
  toJSON(): IntersectionLoopsJSON {
    return {
      intersectionLoops: this.intersectionLoops.map((il) => il.toJSON()),
      selection: this.selection,
      indices: this.indices,
    };
  }

  /**
   * Deserializes the intersection loops from the given JSON.
   *
   * @param json - The JSON holding the serialized intersection loops.
   * @return  A reference to this intersection loops.
   */
  fromJSON(json: IntersectionLoopsJSON): this {
    this.intersectionLoops = json.intersectionLoops.map((il) =>
      new IntersectionLoop().fromJSON(il)
    );
    this.selection = json.selection;
    this.indices = json.indices;

    return this;
  }
}

/**
 * The {@link IntersectionLoops} JSON interface.
 */
export interface IntersectionLoopsJSON {
  /** {@link IntersectionLoops#intersectionLoops} */
  intersectionLoops: IntersectionLoopJSON[];
  /** {@link IntersectionLoops#selection} */
  selection: IntersectionLoops["selection"];
  /** {@link IntersectionLoops#indices} */
  indices: number[];
}
