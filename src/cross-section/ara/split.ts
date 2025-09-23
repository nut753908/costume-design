import type * as THREE from "three";
import { Area } from "../area";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";

// TODO: test
/**
 * Add intersections.
 *
 * @return  The geometry and the cross sections with added intersections.
 */
export function addIntersections(
  geometry: THREE.BufferGeometry,
  area: Area
): { geometry: THREE.BufferGeometry; area: Area } {
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;

  // Set newGeometry.
  let newGeometry = geometry.clone();
  Object.entries(area.crossSections).forEach(([_, v]) => {
    const ils = getIls(
      newGeometry,
      v.plane,
      v.ilp.getIlIndices(v.plane, positions)
    );
    const obj = splitGeometryUsingIls(newGeometry, ils);
    newGeometry = obj.geometry;
  });

  // Set newArea.
  const newArea = area.clone();
  Object.entries(newArea.crossSections).forEach(([_, v]) => {
    const ilIndices = v.ilp.getIlIndices(v.plane, positions);
    const ils = getIls(newGeometry, v.plane, ilIndices);
    ilIndices.forEach((i, i2) => {
      v.ilp.intersectionLoops[i] = ils[i2];
    });
  });

  return { geometry: newGeometry, area: newArea };
}

// TODO: test
/**
 * Get intersection loops.
 *
 * @param ilIndices - The indices of the intersection loops with a plane.
 */
export function getIls(
  geometry: THREE.BufferGeometry,
  plane: FreePlane | VerticalPlane,
  ilIndices: number[]
): IntersectionLoop[] {
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const indices = geometry.getIndex() as THREE.BufferAttribute;
  const planeToAllIls = Area.createPlaneToAllIls(positions, indices);
  const allIls = planeToAllIls(plane);
  return ilIndices.map((_, i) => allIls[i]);
}

// TODO: test
/**
 * Split geometry using intersection loops.
 *
 * @param ils - The intersection loops with a plane.
 * @return  The geometry and the intersection loops after splitting faces.
 */
export function splitGeometryUsingIls(
  geometry: THREE.BufferGeometry,
  ils: IntersectionLoop[]
): { geometry: THREE.BufferGeometry; ils: IntersectionLoop[] } {
  let newGeometry = geometry;
  const newIls: IntersectionLoop[] = [];
  ils.forEach((il) => {
    const obj = splitGeometryUsingIl(newGeometry, il);
    newGeometry = obj.geometry;
    newIls.push(obj.il);
  });
  return { geometry: newGeometry, ils: newIls };
}

// TODO: test
/**
 * Split geometry using an intersection loop.
 *
 * @param il - The intersection loop with a plane.
 * @return  The geometry and the intersection loop after splitting faces.
 */
export function splitGeometryUsingIl(
  geometry: THREE.BufferGeometry,
  il: IntersectionLoop
): { geometry: THREE.BufferGeometry; il: IntersectionLoop } {
  const newGeometry = geometry.clone();
  const newIl = il.clone();
  // TODO: implementation
  return { geometry: newGeometry, il: newIl };
}
