import type { EdgeIntersection } from "./edge-intersection";
import { createIndicesMap } from "./indices";
import type { VertexIntersection } from "./vertex-intersection";

// TODO: make e1,e2,firstE,v1,v2,firstV common
// TODO: add second{E,V} in the same way as createAllEdgeLoopStacks()
// TODO: test
/**
 * Create all intersection loops with a plane.
 *
 * @param triangularPolygonIndices - The triangular polygon indices.
 * @param intersections - All edge/vertex intersections with a plane.
 */
export function createAllIntersectionLoops(
  triangularPolygonIndices: [number, number, number][],
  intersections: {
    edge: EdgeIntersection[];
    vertex: VertexIntersection[];
  }
): (EdgeIntersection | VertexIntersection)[][] {
  const indicesMap = createIndicesMap(triangularPolygonIndices);
  const iLoops: (EdgeIntersection | VertexIntersection)[][] = []; // intersection loops
  for (let i = 0, l = intersections.edge.length; i < l; i++) {
    let i1: EdgeIntersection | VertexIntersection = intersections.edge[i];
    if (i1.checked) continue;
    i1.checked = true;
    const firstI: EdgeIntersection | VertexIntersection = i1;
    const iLoop: (EdgeIntersection | VertexIntersection)[] = [i1]; // intersection loop
    let count = 0;
    let isClosed = false;
    firstLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("firstLoop: count > 1000");
        break;
      }
      const indicesMap2 = createIndicesMap(indicesMap[i1.toString()]);
      for (let j = 0; j < l; j++) {
        const i2: EdgeIntersection | VertexIntersection = intersections.edge[j];
        if (i2.checked) continue;
        if (i2.equals(firstI)) {
          isClosed = true;
          break firstLoop;
        }
        if (i2.toString() in indicesMap2) {
          i2.checked = true;
          iLoop.push(i2);
          i1 = i2;
          continue firstLoop;
        }
      }
      for (let j = 0, l2 = intersections.vertex.length; j < l2; j++) {
        const i2: EdgeIntersection | VertexIntersection =
          intersections.vertex[j];
        if (i2.checked) continue;
        if (i1.topV === i2.v || i1.bottomV === i2.v) continue;
        if (i2.toString() in indicesMap2) {
          i2.checked = true;
          iLoop.push(i2);
          continue firstLoop;
        }
      }
      console.error("firstLoop: vertex or edge not found");
      break;
    }
    if (isClosed) iLoops.push(iLoop);
  }
  for (let i = 0, l = intersections.vertex.length; i < l; i++) {
    let i1: EdgeIntersection | VertexIntersection = intersections.vertex[i];
    if (i1.checked) continue;
    i1.checked = true;
    const firstI = i1;
    const iLoop: (EdgeIntersection | VertexIntersection)[] = [i1]; // intersection loop
    let count = 0;
    let isClosed = false;
    secondLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("secondLoop: count > 1000");
        break;
      }
      const indicesMap2 = createIndicesMap(indicesMap[i1.toString()]);
      for (let j = 0; j < l; j++) {
        const i2: EdgeIntersection | VertexIntersection =
          intersections.vertex[j];
        if (i2.checked) continue;
        if (i2.equals(firstI)) {
          isClosed = true;
          break secondLoop;
        }
        if (i2.toString() in indicesMap2) {
          i2.checked = true;
          iLoop.push(i2);
          i1 = i2;
          continue secondLoop;
        }
      }
      for (let j = 0, l2 = intersections.edge.length; j < l2; j++) {
        const i2: EdgeIntersection | VertexIntersection = intersections.edge[j];
        if (i2.checked) continue;
        if (i1.v === i2.topV || i1.v === i2.bottomV) continue;
        if (i2.toString() in indicesMap2) {
          i2.checked = true;
          iLoop.push(i2);
          continue secondLoop;
        }
      }
      console.error("secondLoop: vertex or edge not found");
      break;
    }
    if (isClosed) iLoops.push(iLoop);
  }
  return iLoops;
}
