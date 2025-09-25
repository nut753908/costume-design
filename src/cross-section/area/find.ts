import * as THREE from "three";
import { getPoint } from "../centerline/points";
import { convertToLists } from "../intersection/indices";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import type { VertexIntersection } from "../intersection/vertex-intersection";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";
import type { Area } from "./area";

/**
 * Find adjacent faces within the area.
 *
 * @param area - The area after cutting faces.
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
 * @param il - The intersection loop after cutting faces.
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
  const refP = plane.getPoint();
  const normal = plane.getNormal();
  const vertices = il.intersections.map((v) => (v as VertexIntersection).v);
  vertices.forEach((v) => {
    // Add to foundVertices.
    if (!foundVertices.includes(v)) foundVertices.push(v);

    // Add to firstFaces.
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

/**
 * Create geometry from the found faces.
 *
 * @param foundVertices - The found vertices. Each vertex found is added to this.
 * @param foundFaces - The found faces. Each face found is added to this.
 */
export function createGeometryfromFoundFaces(
  foundVertices: number[],
  foundFaces: number[][],
  geometry: THREE.BufferGeometry
): THREE.BufferGeometry {
  const positions = geometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const normals = geometry.getAttribute(
    "normal"
  ) as THREE.Float32BufferAttribute;
  const uvs = geometry.getAttribute("uv") as THREE.Float32BufferAttribute;

  const positionLists = convertToLists(positions, 3);
  const normalLists = convertToLists(normals, 3);
  const uvLists = convertToLists(uvs, 2);

  const map = Object.fromEntries(foundVertices.map((v, i) => [v, i]));
  const newIndexLists = foundFaces.map((f) => f.map((v) => map[v]));
  const newPositionList = foundVertices.map((v) => positionLists[v]);
  const newNormalLists = foundVertices.map((v) => normalLists[v]);
  const newUvLists = foundVertices.map((v) => uvLists[v]);

  const newGeometry = new THREE.BufferGeometry();
  newGeometry.setIndex(
    new THREE.Uint16BufferAttribute(newIndexLists.flat(), 1)
  );
  newGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(newPositionList.flat(), 3)
  );
  newGeometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(newNormalLists.flat(), 3)
  );
  newGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(newUvLists.flat(), 2)
  );

  return newGeometry;
}
