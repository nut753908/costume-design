import * as THREE from "three";
import { Edge } from "../centerline/edge";
import { EdgeLoop } from "../centerline/edge-loop";

/**
 * Extrude the positions.
 *
 * @param positions - The results of geometry.getAttribute("position").
 * @param normals - The results of geometry.getAttribute("normal").
 * @param displacement - The extrusion displacement in the normal direction.
 * @returns
 */
export function extrudePositions(
  positions: THREE.Float32BufferAttribute,
  normals: THREE.Float32BufferAttribute,
  displacement: number
) {
  if (positions.array.length !== normals.array.length) {
    console.error(`\
positions.array.length !== normals.array.length
- positions: ${JSON.stringify(positions)}
- normals: ${JSON.stringify(normals)}
`);
    return;
  }
  for (let i = 0, l = positions.array.length; i < l; i += 3) {
    const normal = new THREE.Vector3(
      normals.array[i],
      normals.array[i + 1],
      normals.array[i + 2]
    );
    const diff = normal.clone().multiplyScalar(displacement);
    positions.array[i] += diff.x;
    positions.array[i + 1] += diff.y;
    positions.array[i + 2] += diff.z;
  }
}

/**
 * Flip the normals.
 *
 * @param normals - The results of geometry.getAttribute("normal").
 */
export function flipNormals(normals: THREE.Float32BufferAttribute) {
  for (let i = 0, l = normals.array.length; i < l; i++) {
    normals.array[i] *= -1;
  }
}

/**
 * Find the boundaries as edge loops with only one face per edge.
 *
 * @param indicesMap - The indices map. The key is a string of one or two vertices.
 */
export function findBoundaries(
  allEdges: Edge[],
  indicesMap: { [k: string]: number[][] }
): EdgeLoop[] {
  const edges = allEdges.filter(
    (e) => indicesMap[`${e.v1},${e.v2}`].length === 1
  );
  const els: EdgeLoop[] = []; // edgeLoops
  // e: edge
  edges.forEach((e) => {
    if (e.checked) return;
    e.checked = true;
    const vertices = [e.v1];
    let count = 0;
    let opened = true;
    whileLoop: while (true) {
      count += 1;
      if (count > 1000) {
        console.error("whileLoop: count > 1000");
        break;
      }
      for (let i = 0, l = edges.length; i < l; i++) {
        const e2 = edges[i]; // edge2
        if (e.v2 === vertices[0]) {
          opened = false;
          break whileLoop;
        }
        if (e2.checked) continue;
        if (e.equals(e2)) continue;
        if (e.v2 === e2.v1) {
          vertices.push(e.v2);
          e2.checked = true;
          e = e2.clone();
          continue whileLoop;
        }
        if (e.v2 === e2.v2) {
          vertices.push(e.v2);
          e2.checked = true;
          e = new Edge(e2.v2, e2.v1);
          continue whileLoop;
        }
      }
      console.error("next edge not found");
      break;
    }
    const el = new EdgeLoop(vertices, !opened); // edgeLoop
    els.push(el);
  });
  return els;
}
