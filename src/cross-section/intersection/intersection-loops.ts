import type { EdgeIntersection } from "./edge-intersection";
import { createIndicesMap } from "./indices";
import type { VertexIntersection } from "./vertex-intersection";

// TODO: create a base class for edge/vertex intersection -> equals(),toString(),etc.
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
  const intersectionLoops: (EdgeIntersection | VertexIntersection)[][] = [];
  for (let i = 0, l = intersections.edge.length; i < l; i++) {
    let e1 = intersections.edge[i];
    if (e1.checked) continue;
    e1.checked = true;
    const firstE = e1;
    const intersectionLoop: (EdgeIntersection | VertexIntersection)[] = [e1];
    let count = 0;
    let isClosed = false;
    firstLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("firstLoop: count > 1000");
        break;
      }
      const indicesMap2 = createIndicesMap(
        indicesMap[`${e1.topV},${e1.bottomV}`]
      );
      for (let j = 0; j < l; j++) {
        const e2 = intersections.edge[j];
        if (e2.checked) continue;
        if (e2.topV === firstE.topV && e2.bottomV === firstE.bottomV) {
          isClosed = true;
          break firstLoop;
        }
        if (`${e2.topV},${e2.bottomV}` in indicesMap2) {
          e2.checked = true;
          intersectionLoop.push(e2);
          e1 = e2;
          continue firstLoop;
        }
      }
      for (let j = 0, l2 = intersections.vertex.length; j < l2; j++) {
        const v = intersections.vertex[j];
        if (v.checked) continue;
        if (e1.topV === v.v || e1.bottomV === v.v) continue;
        if (`${v.v}` in indicesMap2) {
          v.checked = true;
          intersectionLoop.push(v);
          continue firstLoop;
        }
      }
      console.error("firstLoop: vertex or edge not found");
      break;
    }
    if (isClosed) intersectionLoops.push(intersectionLoop);
  }
  for (let i = 0, l = intersections.vertex.length; i < l; i++) {
    let v1 = intersections.vertex[i];
    if (v1.checked) continue;
    v1.checked = true;
    const firstV = v1;
    const intersectionLoop: (EdgeIntersection | VertexIntersection)[] = [v1];
    let count = 0;
    let isClosed = false;
    secondLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("secondLoop: count > 1000");
        break;
      }
      const indicesMap2 = createIndicesMap(indicesMap[`${v1.v}`]);
      for (let j = 0; j < l; j++) {
        const v2 = intersections.vertex[j];
        if (v2.checked) continue;
        if (v2.v === firstV.v) {
          isClosed = true;
          break secondLoop;
        }
        if (`${v2.v}` in indicesMap2) {
          v2.checked = true;
          intersectionLoop.push(v2);
          v1 = v2;
          continue secondLoop;
        }
      }
      for (let j = 0, l2 = intersections.edge.length; j < l2; j++) {
        const e = intersections.edge[j];
        if (e.checked) continue;
        if (v1.v === e.topV || v1.v === e.bottomV) continue;
        if (`${e.topV},${e.bottomV}` in indicesMap2) {
          e.checked = true;
          intersectionLoop.push(e);
          continue secondLoop;
        }
      }
      console.error("secondLoop: vertex or edge not found");
      break;
    }
    if (isClosed) intersectionLoops.push(intersectionLoop);
  }
  return intersectionLoops;
}
