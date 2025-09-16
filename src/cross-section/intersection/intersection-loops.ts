import type { EdgeIntersection } from "./edge-intersection";
import { createIndicesMap } from "./indices";
import type { VertexIntersection } from "./vertex-intersection";

// TODO: add second{E,V} in the same way as createAllEdgeLoopStacks()
// TODO: test
/**
 * Create all intersection loops with a plane.
 *
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 * @param intersections - All edge/vertex intersections with a plane.
 */
export function createAllIntersectionLoops(
  indicesMap: { [k: string]: number[][] },
  intersections: (EdgeIntersection | VertexIntersection)[]
): (EdgeIntersection | VertexIntersection)[][] {
  const iLoops: (EdgeIntersection | VertexIntersection)[][] = []; // intersection loops
  for (let i = 0, l = intersections.length; i < l; i++) {
    let i1 = intersections[i];
    if (i1.checked) continue;
    i1.checked = true;
    const firstI = i1;
    const iLoop = [i1]; // intersection loop
    let count = 0;
    let isClosed = false;
    whileLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("whileLoop: count > 1000");
        break;
      }
      const indicesMap2 = createIndicesMap(indicesMap[i1.toString()]);
      for (let j = 0; j < l; j++) {
        const i2 = intersections[j];
        if (i2.checked) continue;
        if (i2.has(i1)) continue;
        if (i2.equals(firstI)) {
          isClosed = true;
          break whileLoop;
        }
        if (i2.toString() in indicesMap2) {
          i2.checked = true;
          iLoop.push(i2);
          i1 = i2;
          continue whileLoop;
        }
      }
      console.error("whileLoop: vertex or edge not found");
      break;
    }
    if (isClosed) iLoops.push(iLoop);
  }
  return iLoops;
}
