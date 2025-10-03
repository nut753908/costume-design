import * as THREE from "three";
import { getPoint } from "../centerline/points";
import { EdgeIntersection } from "../intersection/edge-intersection";
import { convertToLists, createIndicesMap } from "../intersection/indices";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import { VertexIntersection } from "../intersection/vertex-intersection";
import { Area } from "./area";

/**
 * Cut geometry using intersection loops within the area.
 *
 * @return  The geometry and the area after cutting faces.
 */
export function cutGeometryUsingIlsWithinArea(
  geometry: THREE.BufferGeometry,
  area: Area
): { geometry: THREE.BufferGeometry; area: Area } {
  // Set newGeometry.
  let newGeometry = geometry;
  Object.entries(area.crossSections).forEach(([_, v]) => {
    const positions = newGeometry.getAttribute(
      "position"
    ) as THREE.Float32BufferAttribute;
    const indices = newGeometry.getIndex() as THREE.Uint16BufferAttribute;
    const planeToAllIls = Area.createPlaneToAllIls(positions, indices);
    const allIls = planeToAllIls(v.plane);
    const ilIndices = v.ilp.getIlIndices(v.plane, positions);

    const ils = ilIndices.map((i) => allIls[i]);
    const obj = cutGeometryUsingIls(newGeometry, ils, v.plane.getNormal());
    newGeometry = obj.geometry;
  });

  // Set newArea.
  const newArea = area.clone();
  const positions = newGeometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const indices = newGeometry.getIndex() as THREE.Uint16BufferAttribute;
  const planeToAllIls = Area.createPlaneToAllIls(positions, indices);
  Object.entries(newArea.crossSections).forEach(([_, v]) => {
    const allIls = planeToAllIls(v.plane);
    const ilIndices = v.ilp.getIlIndices(v.plane, positions);

    ilIndices.forEach((i) => {
      v.ilp.intersectionLoops[i] = allIls[i];
    });
  });

  return { geometry: newGeometry, area: newArea };
}

/**
 * Cut geometry using intersection loops.
 *
 * @param ils - The intersection loops with a plane.
 * @param normal - The normal direction of the intersection loop plane.
 * @return  The geometry and the intersection loops after cutting faces.
 */
export function cutGeometryUsingIls(
  geometry: THREE.BufferGeometry,
  ils: IntersectionLoop[],
  normal: THREE.Vector3
): { geometry: THREE.BufferGeometry; ils: IntersectionLoop[] } {
  let newGeometry = geometry;
  const newIls: IntersectionLoop[] = [];
  ils.forEach((il) => {
    const obj = cutGeometryUsingIl(newGeometry, il, normal);
    newGeometry = obj.geometry;
    newIls.push(obj.il);
  });
  return { geometry: newGeometry, ils: newIls };
}

/**
 * Cut geometry using an intersection loop.
 *
 * @param il - The intersection loop with a plane.
 * @param normal - The normal direction of the intersection loop plane.
 * @return  The geometry and the intersection loop after cutting faces.
 */
export function cutGeometryUsingIl(
  geometry: THREE.BufferGeometry,
  il: IntersectionLoop,
  normal: THREE.Vector3
): { geometry: THREE.BufferGeometry; il: IntersectionLoop } {
  const indices = geometry.getIndex() as THREE.Uint16BufferAttribute;
  const positions = geometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const normals = geometry.getAttribute(
    "normal"
  ) as THREE.Float32BufferAttribute;
  const uvs = geometry.getAttribute("uv") as THREE.Float32BufferAttribute;

  const indexLists = convertToLists(indices, 3);
  const positionLists = convertToLists(positions, 3);
  const normalLists = convertToLists(normals, 3);
  const uvLists = convertToLists(uvs, 2);

  const indicesMap = createIndicesMap(indexLists); // TODO: bring the original

  // Set newIl, positionLists, normalLists, uvLists.
  const newIl = il.clone();
  let count = positions.count;
  il.intersections.forEach((v, i) => {
    if (!(v instanceof EdgeIntersection)) return;
    newIl.intersections[i] = new VertexIntersection(count);
    count += 1;
    positionLists.push(v.getPoint(positions).toArray());
    normalLists.push(v.getNormal(normals).toArray());
    uvLists.push(v.getUv(uvs).toArray());
  });

  // Set indexLists.
  const isCounterclockwise = il.isCounterclockwise(normal, positions);
  if (isCounterclockwise) {
    il.intersections.reverse();
    newIl.intersections.reverse();
  }
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
        indexLists.push([newV0.v, v0.frontV, newV1.v]);
        const pointNewV0 = getPoint(newPositions, newV0.v);
        const pointNewV1 = getPoint(newPositions, newV1.v);
        const pointV0BackV = getPoint(newPositions, v0.backV);
        const pointV1BackV = getPoint(newPositions, v1.backV);
        const diff1 = pointNewV0.clone().sub(pointV1BackV);
        const diff2 = pointNewV1.clone().sub(pointV0BackV);
        if (diff1.length() < diff2.length()) {
          // Use diff1(＼) as the diagonal.
          indexLists.push([v0.backV, newV0.v, v1.backV]);
          indexLists.push([newV0.v, newV1.v, v1.backV]);
        } else {
          // Use diff2(／) as the diagonal.
          indexLists.push([v0.backV, newV0.v, newV1.v]);
          indexLists.push([v0.backV, newV1.v, v1.backV]);
        }
      } else {
        // This case: v0.backV === v1.backV
        indexLists.push([v0.backV, newV0.v, newV1.v]);
        const pointNewV0 = getPoint(newPositions, newV0.v);
        const pointNewV1 = getPoint(newPositions, newV1.v);
        const pointV0FrontV = getPoint(newPositions, v0.frontV);
        const pointV1FrontV = getPoint(newPositions, v1.frontV);
        const diff1 = pointNewV0.clone().sub(pointV1FrontV);
        const diff2 = pointNewV1.clone().sub(pointV0FrontV);
        if (diff1.length() < diff2.length()) {
          // Use diff1(／) as the diagonal.
          indexLists.push([newV0.v, v0.frontV, v1.frontV]);
          indexLists.push([newV0.v, v1.frontV, newV1.v]);
        } else {
          // Use diff2(＼) as the diagonal.
          indexLists.push([newV0.v, v0.frontV, newV1.v]);
          indexLists.push([v0.frontV, v1.frontV, newV1.v]);
        }
      }
    } else if (
      v0 instanceof EdgeIntersection &&
      v1 instanceof VertexIntersection
    ) {
      const newV0 = newIl.intersections[i] as VertexIntersection;
      indexLists.push([newV0.v, v0.frontV, v1.v]);
      indexLists.push([v0.backV, newV0.v, v1.v]);
    } else if (
      v0 instanceof VertexIntersection &&
      v1 instanceof EdgeIntersection
    ) {
      const newV1 = newIl.intersections[i + 1] as VertexIntersection;
      indexLists.push([v0.v, v1.frontV, newV1.v]);
      indexLists.push([v0.v, newV1.v, v1.backV]);
    }
  }
  if (il.closed) {
    il.intersections.pop();
    newIl.intersections.pop();
  }
  if (isCounterclockwise) {
    il.intersections.reverse();
    newIl.intersections.reverse();
  }

  const newGeometry = new THREE.BufferGeometry();
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
