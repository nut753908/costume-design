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
    let i2 = allIntersections[i]; // intersection2
    if (i2.checked) continue;
    i2.checked = true;
    const firstI = i2; // firstIntersection
    const iLoop = [i2]; // intersectionLoop
    let i1 = i2; // intersection1
    let count = 0;
    let isClosed = false;
    whileLoop: while (true) {
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
          isClosed = true;
          break whileLoop;
        }
        i3.checked = true;
        iLoop.push(i3);
        i1 = i2;
        i2 = i3;
        continue whileLoop;
      }
      console.error("whileLoop: vertex or edge not found");
      break;
    }
    if (isClosed) iLoops.push(iLoop);
  }
  return iLoops;
}
