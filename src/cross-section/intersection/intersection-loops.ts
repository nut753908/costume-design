import type { EdgeIntersection } from "./edge-intersection";
import { createIndicesMap } from "./indices";
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
): (EdgeIntersection | VertexIntersection)[][] {
  const iLoops: (EdgeIntersection | VertexIntersection)[][] = []; // intersectionLoops
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
    iLoops.push(iLoop);
  }
  return iLoops;
}
