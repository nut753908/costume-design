import type * as THREE from "three";
import { createAllEdges } from "../centerline/edges";
import { getPoint } from "../centerline/points";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";
import { EdgeIntersection } from "./edge-intersection";
import { VertexIntersection } from "./vertex-intersection";

/**
 * Create all edge/vertex intersections with a plane.
 *
 * @param positions - The results of geometry.getAttribute("position").
 * @param indices - The results of geometry.getIndex().
 */
export function createAllIntersections(
  plane: FreePlane | VerticalPlane,
  positions: THREE.BufferAttribute,
  indices: THREE.BufferAttribute
): {
  edge: EdgeIntersection[];
  vertex: VertexIntersection[];
} {
  const edges: EdgeIntersection[] = [];
  const vertices: VertexIntersection[] = [];
  const refP = plane.getPoint();
  const bottomNormal = plane.getBottomNormal();
  const nPolygonIndices = getNPolygonIndices(indices);
  const allEdges = createAllEdges(nPolygonIndices);
  for (let i = 0, l = allEdges.length; i < l; i++) {
    const e = allEdges[i];
    const p1 = getPoint(positions, e.v1);
    const p2 = getPoint(positions, e.v2);
    const diff1 = p1.clone().sub(refP);
    const diff2 = p2.clone().sub(refP);
    const bottom1 = bottomNormal.dot(diff1);
    const bottom2 = bottomNormal.dot(diff2);
    const top1 = -bottom1;
    const top2 = -bottom2;
    if (bottom1 > 0 && top2 > 0) {
      const u = bottom1 / (bottom1 + top2);
      edges.push(new EdgeIntersection(e.v1, e.v2, u));
    } else if (bottom2 > 0 && top1 > 0) {
      const u = bottom2 / (bottom2 + top1);
      edges.push(new EdgeIntersection(e.v2, e.v1, u));
    }
  }
  for (let i = 0, l = positions.count; i < l; i++) {
    const p = getPoint(positions, i);
    const diff = p.clone().sub(refP);
    const bottom = bottomNormal.dot(diff);
    if (bottom === 0) vertices.push(new VertexIntersection(i));
  }
  return { edge: edges, vertex: vertices };
}

/**
 * Get the n polygon indices.
 *
 * @param indices - The results of geometry.getIndex().
 * @return  The n polygon indices.
 */
export function getNPolygonIndices(indices: THREE.BufferAttribute): number[][] {
  const nPolygonIndices: number[][] = [];
  for (let i = 0, l = indices.count; i < l; i += 3) {
    nPolygonIndices.push([
      indices.array[i],
      indices.array[i + 1],
      indices.array[i + 2],
    ]);
  }
  return nPolygonIndices;
}
