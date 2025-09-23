import * as THREE from "three";
import { Area } from "../area";
import { getPoint } from "../centerline/points";
import { EdgeIntersection } from "../intersection/edge-intersection";
import { convertToLists, createIndicesMap } from "../intersection/indices";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import { VertexIntersection } from "../intersection/vertex-intersection";
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
  const positions = geometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;

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
  const positions = geometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const indices = geometry.getIndex() as THREE.Uint16BufferAttribute;
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

  const indices = newGeometry.getIndex() as THREE.Uint16BufferAttribute;
  const positions = newGeometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const normals = newGeometry.getAttribute(
    "normal"
  ) as THREE.Float32BufferAttribute;
  const uvs = newGeometry.getAttribute("uv") as THREE.Float32BufferAttribute;

  const indexLists = convertToLists(indices, 3);
  const positionLists = convertToLists(positions, 3);
  const normalLists = convertToLists(normals, 3);
  const uvLists = convertToLists(uvs, 2);

  const indicesMap = createIndicesMap(indexLists);

  // Set newIl, positionLists, normalLists, uvLists.
  let count = positions.count;
  il.intersections
    .filter((v) => v instanceof EdgeIntersection)
    .forEach((v, i) => {
      newIl.intersections[i] = new VertexIntersection(count);
      count += 1;
      positionLists.push(v.getPoint(positions).toArray());
      normalLists.push(v.getNormal(normals).toArray());
      uvLists.push(v.getUv(uvs).toArray());
    });

  // Set indexLists.
  if (il.closed) {
    il.intersections.push(il.intersections[0]);
    newIl.intersections.push(newIl.intersections[0]);
  }
  for (let i = 0, l = il.intersections.length - 1; i < l; i++) {
    const v0 = il.intersections[i];
    const v1 = il.intersections[i + 1];
    if (v0 instanceof VertexIntersection && v1 instanceof VertexIntersection) {
      continue;
    }

    // Remove from indexLists.
    const indicesV0 = indicesMap[v0.toString()];
    const indicesMap2 = createIndicesMap(indicesV0);
    const indicesV1 = indicesMap2[v1.toString()];
    if (indicesV1 === undefined || indicesV1.length !== 1) {
      console.error(`
indicesV1 === undefined || indicesV1.length !== 1
indexLists: ${JSON.stringify(indexLists)}
indicesMap: ${JSON.stringify(indicesMap)}
i: ${i}
v0: ${JSON.stringify(v0)}
v1: ${JSON.stringify(v1)}
indicesV0: ${JSON.stringify(indicesV0)}
indicesMap2: ${JSON.stringify(indicesMap2)}
indicesV1: ${JSON.stringify(indicesV1)}
`);
      continue;
    }
    const index = indexLists.indexOf(indicesV1[0]);
    if (index === -1) {
      console.error(`
index === -1
indexLists: ${JSON.stringify(indexLists)}
indicesMap: ${JSON.stringify(indicesMap)}
i: ${i}
v0: ${JSON.stringify(v0)}
v1: ${JSON.stringify(v1)}
indicesV0: ${JSON.stringify(indicesV0)}
indicesMap2: ${JSON.stringify(indicesMap2)}
indicesV1: ${JSON.stringify(indicesV1)}
`);
      continue;
    }
    indexLists.splice(index, 1);

    // Add to indexLists.
    if (v0 instanceof EdgeIntersection && v1 instanceof EdgeIntersection) {
      const newV0 = newIl.intersections[i] as VertexIntersection;
      const newV1 = newIl.intersections[i + 1] as VertexIntersection;
      const newPositions = new THREE.Float32BufferAttribute(
        positionLists.flat(),
        3
      );
      if (v0.frontV === v1.frontV) {
        indexLists.push([v0.frontV, newV0.v, newV1.v]);
        const pointNewV0 = getPoint(newPositions, newV0.v);
        const pointNewV1 = getPoint(newPositions, newV1.v);
        const pointV0BackV = getPoint(newPositions, v0.backV);
        const pointV1BackV = getPoint(newPositions, v1.backV);
        const diff1 = pointNewV0.clone().sub(pointV1BackV);
        const diff2 = pointNewV1.clone().sub(pointV0BackV);
        if (diff1.length() < diff2.length()) {
          // use diff1(＼) as the diagonal
          indexLists.push([newV0.v, v1.backV, newV1.v]);
          indexLists.push([newV0.v, v0.backV, v1.backV]);
        } else {
          // use diff2(／) as the diagonal
          indexLists.push([newV0.v, v0.backV, newV1.v]);
          indexLists.push([v0.backV, v1.backV, newV1.v]);
        }
      } else {
        // This case: v0.backV === v1.backV
        indexLists.push([newV0.v, v0.backV, newV1.v]);
        const pointNewV0 = getPoint(newPositions, newV0.v);
        const pointNewV1 = getPoint(newPositions, newV1.v);
        const pointV0FrontV = getPoint(newPositions, v0.frontV);
        const pointV1FrontV = getPoint(newPositions, v1.frontV);
        const diff1 = pointNewV0.clone().sub(pointV1FrontV);
        const diff2 = pointNewV1.clone().sub(pointV0FrontV);
        if (diff1.length() < diff2.length()) {
          // use diff1(／) as the diagonal
          indexLists.push([v0.frontV, newV0.v, v1.frontV]);
          indexLists.push([newV0.v, newV1.v, v1.frontV]);
        } else {
          // use diff2(＼) as the diagonal
          indexLists.push([v0.frontV, newV1.v, v1.frontV]);
          indexLists.push([v0.frontV, newV0.v, newV1.v]);
        }
      }
    } else if (
      v0 instanceof EdgeIntersection &&
      v1 instanceof VertexIntersection
    ) {
      const newV0 = newIl.intersections[i] as VertexIntersection;
      indexLists.push([v0.frontV, newV0.v, v1.v]);
      indexLists.push([newV0.v, v0.backV, v1.v]);
    } else if (
      v0 instanceof VertexIntersection &&
      v1 instanceof EdgeIntersection
    ) {
      const newV1 = newIl.intersections[i + 1] as VertexIntersection;
      indexLists.push([v0.v, newV1.v, v1.frontV]);
      indexLists.push([v0.v, v1.backV, newV1.v]);
    }
  }
  if (il.closed) {
    il.intersections.pop();
    newIl.intersections.pop();
  }

  newGeometry.setIndex(new THREE.Uint16BufferAttribute(indexLists.flat(), 1));
  newGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionLists.flat(), 3)
  );
  newGeometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(normalLists.flat(), 3)
  );
  newGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(uvLists.flat(), 2)
  );

  return { geometry: newGeometry, il: newIl };
}
