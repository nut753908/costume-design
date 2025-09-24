import type * as THREE from "three";
import type { Area } from "../area";
import { getPoint } from "../centerline/points";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import type { VertexIntersection } from "../intersection/vertex-intersection";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";

/**
 * Find adjacent faces within the area.
 *
 * @param foundVertices - The found vertices. Each vertex found is added to this.
 * @param foundFaces - The found faces. Each face found is added to this.
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 * @param positions - The results of geometry.getAttribute("position").
 */
export function findAdjacentFacesWithinArea(
  area: Area,
  foundVertices: number[],
  foundFaces: number[][],
  indicesMap: { [k: string]: number[][] },
  positions: THREE.Float32BufferAttribute
) {
  const firstFaces: number[][] = [];

  // Add to foundVertices and firstFaces.
  Object.values(area.crossSections).forEach((cs) => {
    cs.ilp.intersectionLoops.forEach((il) => {
      findFirstFaces(
        cs.plane,
        il,
        foundVertices,
        firstFaces,
        indicesMap,
        positions
      );
    });
  });

  // Add to foundVertices and foundFaces.
  firstFaces.forEach((f) => {
    findAdjacentFaces(f, foundVertices, foundFaces, indicesMap);
  });
}

/**
 * Find first faces.
 *
 * @param foundVertices - The found vertices. Each vertex found is added to this.
 * @param firstFaces - The first faces. The adjacent faces of the intersection loop in the normal direction of the plane are added to this.
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 * @param positions - The results of geometry.getAttribute("position").
 */
export function findFirstFaces(
  plane: FreePlane | VerticalPlane,
  il: IntersectionLoop,
  foundVertices: number[],
  firstFaces: number[][],
  indicesMap: { [k: string]: number[][] },
  positions: THREE.Float32BufferAttribute
) {
  // Add to foundVertices, firstFaces.
  const refP = plane.getPoint();
  const normal = plane.getNormal();
  const vertices = il.intersections.map((v) => (v as VertexIntersection).v);
  vertices.forEach((v) => {
    if (!foundVertices.includes(v)) foundVertices.push(v);
    const faces = indicesMap[`${v}`];
    faces.forEach((f) => {
      f.filter((v2) => !vertices.includes(v2)).forEach((v2) => {
        const p = getPoint(positions, v2);
        const diff = p.clone().sub(refP);
        const dot = normal.dot(diff);
        if (dot > 0 && !firstFaces.includes(f)) {
          firstFaces.push(f); // added
          return;
        }
      });
    });
  });
}

/**
 * Find adjacent faces recursively.
 *
 * @param face - The face to start finding.
 * @param foundVertices - The found vertices. Each vertex found is added to this.
 * @param foundFaces - The found faces. Each face found is added to this.
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 */
export function findAdjacentFaces(
  face: number[],
  foundVertices: number[],
  foundFaces: number[][],
  indicesMap: { [k: string]: number[][] }
) {
  // Add to foundFaces.
  if (foundFaces.includes(face)) return;
  foundFaces.push(face);

  face.forEach((v) => {
    // Add to foundVertices.
    if (foundVertices.includes(v)) return;
    foundVertices.push(v);

    // Repeat the same for the next face.
    const faces = indicesMap[`${v}`];
    faces.forEach((f) => {
      findAdjacentFaces(f, foundVertices, foundFaces, indicesMap);
    });
  });
}
