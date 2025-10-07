import type * as THREE from "three";
import type { Edge } from "../centerline/edge";
import { getPoint } from "../centerline/points";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";
import { EdgeIntersection } from "./edge-intersection";
import { VertexIntersection } from "./vertex-intersection";

/**
 * Create all edge/vertex intersections with a plane.
 *
 * @param positions - The results of geometry.getAttribute("position").
 */
export function createAllIntersections(
  plane: FreePlane | VerticalPlane,
  allEdges: Edge[],
  positions: THREE.Float32BufferAttribute
): (EdgeIntersection | VertexIntersection)[] {
  const intersections: (EdgeIntersection | VertexIntersection)[] = [];
  const vSet = new Set();
  const refP = plane.getPoint();
  const normal = plane.getNormal();
  const EPS = 1e-7;
  for (let i = 0, l = allEdges.length; i < l; i++) {
    const e = allEdges[i];
    vSet.add(e.v1);
    vSet.add(e.v2);
    const p1 = getPoint(positions, e.v1);
    const p2 = getPoint(positions, e.v2);
    const diff1 = p1.clone().sub(refP);
    const diff2 = p2.clone().sub(refP);
    const front1 = normal.dot(diff1);
    const front2 = normal.dot(diff2);
    const back1 = -front1;
    const back2 = -front2;
    if (back1 > EPS && front2 > EPS) {
      const u = back1 / (back1 + front2);
      intersections.push(new EdgeIntersection(e.v1, e.v2, u));
    } else if (back2 > EPS && front1 > EPS) {
      const u = back2 / (back2 + front1);
      intersections.push(new EdgeIntersection(e.v2, e.v1, u));
    }
  }
  for (let i = 0, l = positions.count; i < l; i++) {
    if (!vSet.has(i)) continue;
    const p = getPoint(positions, i);
    const diff = p.clone().sub(refP);
    const front = normal.dot(diff);
    if (Math.abs(front) <= EPS) intersections.push(new VertexIntersection(i));
  }
  return intersections;
}
