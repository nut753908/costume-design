import * as THREE from "three";
import { Edge } from "../centerline/edge";
import { EdgeLoop } from "../centerline/edge-loop";

// TODO: add extrudeGeometry()

/**
 * Extrude the positions.
 *
 * @param positions - The results of geometry.getAttribute("position").
 * @param normals - The results of geometry.getAttribute("normal").
 * @param displacement - The extrusion displacement in the normal direction.
 */
export function extrudePositions(
  positions: THREE.Float32BufferAttribute,
  normals: THREE.Float32BufferAttribute,
  displacement: number
) {
  // NOTE: positions and normals counts are not compared here.
  for (let i = 0, l = positions.array.length; i < l; i++) {
    positions.array[i] += normals.array[i] * displacement;
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

// TODO: add createSideGeometry()

/**
 * Concatenate geometries.
 *
 * @param geometries - The geometries to concatenate.
 * @returns  The concatenated geometry.
 */
export function concatGeometries(
  geometries: THREE.BufferGeometry[]
): THREE.BufferGeometry {
  const indicesArrays: number[][] = [];
  const positionsArrays: number[][] = [];
  const normalsArrays: number[][] = [];
  const uvsArrays: number[][] = [];

  let count = 0;
  geometries.forEach((g) => {
    const indices = g.getIndex() as THREE.Uint16BufferAttribute;
    const positions = g.getAttribute("position");
    const normals = g.getAttribute("normal");
    const uvs = g.getAttribute("uv");

    indicesArrays.push(Array.from(indices.array.map((v) => v + count)));
    positionsArrays.push(Array.from(positions.array));
    normalsArrays.push(Array.from(normals.array));
    uvsArrays.push(Array.from(uvs.array));

    // NOTE: positions, normals and uvs counts are not compared here.
    count += positions.count;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint16BufferAttribute(indicesArrays.flat(), 1));
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArrays.flat(), 3)
  );
  geometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(normalsArrays.flat(), 3)
  );
  geometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(uvsArrays.flat(), 2)
  );
  return geometry;
}
