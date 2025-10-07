import * as THREE from "three";
import { Edge } from "../centerline/edge";
import { EdgeLoop } from "../centerline/edge-loop";
import { createAllEdges } from "../centerline/edges";
import { convertToLists, createEdgeIndicesMap } from "../intersection/indices";

/**
 * Extrude geometry.
 *
 * @param geometry - The geometry to extrude.
 * @param displacement - The extrusion displacement in the normal direction.
 * @returns  The extruded geometry.
 */
export function extrudeGeometry(
  geometry: THREE.BufferGeometry,
  displacement: number
): THREE.BufferGeometry {
  const innerGeometry = geometry.clone();
  const innerIndices = innerGeometry.getIndex() as THREE.Uint16BufferAttribute;
  const innerPositions = innerGeometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const innerNormals = innerGeometry.getAttribute(
    "normal"
  ) as THREE.Float32BufferAttribute;
  flipIndices(innerIndices);
  flipNormals(innerNormals);

  const outerGeometry = geometry.clone();
  const outerPositions = outerGeometry.getAttribute(
    "position"
  ) as THREE.Float32BufferAttribute;
  const outerNormals = outerGeometry.getAttribute(
    "normal"
  ) as THREE.Float32BufferAttribute;
  extrudePositions(outerPositions, outerNormals, displacement);

  const indices = geometry.getIndex() as THREE.Uint16BufferAttribute;
  const nPolygonIndices = convertToLists(indices, 3);
  const allEdges = createAllEdges(nPolygonIndices);
  const edgeIndicesMap = createEdgeIndicesMap(nPolygonIndices);
  const boundaries = findBoundaries(allEdges, edgeIndicesMap);
  const sideGeometries = boundaries.map((boundary) =>
    createSideGeometry(boundary, innerPositions, outerPositions)
  );

  return concatGeometries([innerGeometry, outerGeometry, ...sideGeometries]);
}

/**
 * Flip the indices.
 * (NOTE: indices must be a triangular polygon.)
 *
 * @param indices - The results of geometry.getIndex().
 */
export function flipIndices(indices: THREE.Uint16BufferAttribute) {
  for (let i = 0, l = indices.array.length; i < l; i += 3) {
    const i0 = indices.array[i];
    indices.array[i] = indices.array[i + 2];
    indices.array[i + 2] = i0;
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
 * Find the boundaries as edge loops with only one face per edge.
 *
 * @param edgeIndicesMap - The edge-indices map. The key is a string of two vertices.
 */
export function findBoundaries(
  allEdges: Edge[],
  edgeIndicesMap: { [k: string]: number[][] }
): EdgeLoop[] {
  const edges = allEdges.filter(
    (e) => edgeIndicesMap[`${e.v1},${e.v2}`].length === 1
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

/**
 * Create the side geometry between the inner and outer boundaries.
 * (NOTE: innerPositions and outerPositions counts are not compared here.)
 *
 * @param boundary - the boundary as edge loop with only one face per edge.
 * @param innerPositions - The boundary positions before extruding.
 * @param outerPositions - The boundary positions after extruding.
 * @return  The side geometry.
 */
export function createSideGeometry(
  boundary: EdgeLoop,
  innerPositions: THREE.Float32BufferAttribute,
  outerPositions: THREE.Float32BufferAttribute
): THREE.BufferGeometry {
  // Set indicesArrays.
  const count = boundary.vertices.length;
  const indicesArrays: number[][] = [];
  for (let i = 0, l = count - 1; i < l; i++) {
    const a = i;
    const b = count + i;
    const c = count + i + 1;
    const d = i + 1;
    indicesArrays.push([c, b, a]);
    indicesArrays.push([d, c, a]);
  }
  // (i = count - 1)
  if (boundary.closed) {
    const a = count - 1;
    const b = count + count - 1;
    const c = count;
    const d = 0;
    indicesArrays.push([c, b, a]);
    indicesArrays.push([d, c, a]);
  }

  // Set positionsArrays.
  const _ipLists = convertToLists(innerPositions, 3); // _innerPositionLists
  const _opLists = convertToLists(outerPositions, 3); // _outerPositionLists
  const ipLists = boundary.vertices.map((v) => _ipLists[v]); // innerPositionLists
  const opLists = boundary.vertices.map((v) => _opLists[v]); // outerPositionLists
  const positionsArrays: number[][] = [];
  positionsArrays.push(...ipLists); // inner
  positionsArrays.push(...opLists); // outer

  // Set normalsArrays.
  const nLists: number[][] = []; // normalLists
  // (i = 0)
  if (boundary.closed) {
    const ip1 = new THREE.Vector3().fromArray(ipLists[count - 1]);
    const ip2 = new THREE.Vector3().fromArray(ipLists[0]);
    const ip3 = new THREE.Vector3().fromArray(ipLists[1]);
    const op2 = new THREE.Vector3().fromArray(opLists[0]);
    const right = ip3.clone().sub(ip2);
    const up = op2.clone().sub(ip2);
    const left = ip1.clone().sub(ip2);
    const n1 = right.clone().cross(up).normalize();
    const n2 = up.clone().cross(left).normalize();
    const n12 = n1.clone().add(n2).normalize();
    nLists.push(n12.toArray());
  } else {
    const ip2 = new THREE.Vector3().fromArray(ipLists[0]);
    const ip3 = new THREE.Vector3().fromArray(ipLists[1]);
    const op2 = new THREE.Vector3().fromArray(opLists[0]);
    const right = ip3.clone().sub(ip2);
    const up = op2.clone().sub(ip2);
    const n1 = right.clone().cross(up).normalize();
    nLists.push(n1.toArray());
  }
  for (let i = 1, l = count - 1; i < l; i++) {
    const ip1 = new THREE.Vector3().fromArray(ipLists[i - 1]);
    const ip2 = new THREE.Vector3().fromArray(ipLists[i]);
    const ip3 = new THREE.Vector3().fromArray(ipLists[i + 1]);
    const op2 = new THREE.Vector3().fromArray(opLists[i]);
    const right = ip3.clone().sub(ip2);
    const up = op2.clone().sub(ip2);
    const left = ip1.clone().sub(ip2);
    const n1 = right.clone().cross(up).normalize();
    const n2 = up.clone().cross(left).normalize();
    const n12 = n1.clone().add(n2).normalize();
    nLists.push(n12.toArray());
  }
  // (i = count - 1)
  if (boundary.closed) {
    const ip1 = new THREE.Vector3().fromArray(ipLists[count - 2]);
    const ip2 = new THREE.Vector3().fromArray(ipLists[count - 1]);
    const ip3 = new THREE.Vector3().fromArray(ipLists[0]);
    const op2 = new THREE.Vector3().fromArray(opLists[count - 1]);
    const right = ip3.clone().sub(ip2);
    const up = op2.clone().sub(ip2);
    const left = ip1.clone().sub(ip2);
    const n1 = right.clone().cross(up).normalize();
    const n2 = up.clone().cross(left).normalize();
    const n12 = n1.clone().add(n2).normalize();
    nLists.push(n12.toArray());
  } else {
    const ip1 = new THREE.Vector3().fromArray(ipLists[count - 2]);
    const ip2 = new THREE.Vector3().fromArray(ipLists[count - 1]);
    const op2 = new THREE.Vector3().fromArray(opLists[count - 1]);
    const up = op2.clone().sub(ip2);
    const left = ip1.clone().sub(ip2);
    const n2 = up.clone().cross(left).normalize();
    nLists.push(n2.toArray());
  }
  const normalsArrays: number[][] = [];
  normalsArrays.push(...nLists); // inner
  normalsArrays.push(...nLists); // outer

  // Set uvsArrays.
  const iuLists: number[][] = []; // innerUvLists
  const ouLists: number[][] = []; // outerUvLists
  for (let i = 0, l = count; i < l; i++) {
    const division = i / count;
    iuLists.push([0, division]);
    ouLists.push([1, division]);
  }
  const uvsArrays: number[][] = [];
  uvsArrays.push(...iuLists); // inner
  uvsArrays.push(...ouLists); // outer

  // Set geometry.
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
