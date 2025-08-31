import * as THREE from "three";

/**
 * Create the correct n polygon indices.
 *
 * @param {Array<Array<number>>} nPolygonPositions - The n polygon positions.
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<Array<number>>} The correct n polygon indices.
 */
export function correctNPolygonIndices(
  nPolygonPositions,
  positions,
  nPolygonIndices
) {
  const EPS = Number.EPSILON;
  const map = Array(nPolygonPositions.length);
  for (let i = 0, l1 = nPolygonPositions.length; i < l1; i++) {
    for (let j = 0, l2 = positions.count * 3; j < l2; j += 3) {
      if (
        Math.abs(positions.array[j] - nPolygonPositions[i][0]) < EPS &&
        Math.abs(positions.array[j + 1] - nPolygonPositions[i][2]) < EPS &&
        Math.abs(positions.array[j + 2] + nPolygonPositions[i][1]) < EPS
      ) {
        map[i] = j / 3; // note: one i may have many j's.
        break;
      }
    }
  }
  return nPolygonIndices
    .map((list) => list.map((v) => map[v]))
    .filter((list) => !list.includes(undefined));
}

/**
 * Create the remaining vertices map.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {{[k:string]:Array<Array<number>>}} The remaining vertices map. The key is a string of two vertices.
 */
export function createRemainingVerticesMap(nPolygonIndices) {
  const map = {};
  nPolygonIndices.forEach((list) => {
    for (let i = 0, l = list.length; i < l; i++) {
      const a = list[i];
      const b = i !== list.length - 1 ? list[i + 1] : list[0];
      const cList = list.filter((c) => a !== c && b !== c);
      [`${a},${b}`, `${b},${a}`].forEach((k) => {
        k in map ? map[k].push(cList) : (map[k] = [cList]);
      });
    }
  });
  return map;
}

/**
 * Find the next vertex in the direction v1 -> v2.
 *
 * @param {{[k:string]:Array<Array<number>>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {number} v1 - The first vertex of the edge.
 * @param {number} v2 - The second vertex of the edge.
 * @returns {number} The next vertex.
 */
export function findNextVertex(map, v1, v2) {
  const vs0 = map[`${v1},${v2}`]; // [a,c]
  if (vs0.length !== 2) return null;
  if (vs0[0].length !== 2) return null;
  if (vs0[1].length !== 2) return null;

  let a = null;
  if (`${vs0[0][0]},${v2}` in map) a = vs0[0][0];
  if (`${vs0[0][1]},${v2}` in map) a = vs0[0][1];
  if (a === null) {
    console.error("a === null");
    return null;
  }
  const vs1 = map[`${a},${v2}`];
  if (vs1.length !== 2) return null;
  if (vs1[0].length !== 2) return null;
  if (vs1[1].length !== 2) return null;
  let b = null;
  if (vs1[0].includes(v1)) {
    if (`${vs1[1][0]},${v2}` in map) b = vs1[1][0];
    if (`${vs1[1][1]},${v2}` in map) b = vs1[1][1];
  } else if (vs1[1].includes(v1)) {
    if (`${vs1[0][0]},${v2}` in map) b = vs1[0][0];
    if (`${vs1[0][1]},${v2}` in map) b = vs1[0][1];
  }
  if (b === null) {
    console.error("b === null");
    return null;
  }

  let c = null;
  if (`${vs0[1][0]},${v2}` in map) c = vs0[1][0];
  if (`${vs0[1][1]},${v2}` in map) c = vs0[1][1];
  if (c === null) {
    console.error("c === null");
    return null;
  }
  const vs2 = map[`${c},${v2}`];
  if (vs2.length !== 2) return null;
  if (vs2[0].length !== 2) return null;
  if (vs2[1].length !== 2) return null;
  let d = null;
  if (vs2[0].includes(v1)) {
    if (`${vs2[1][0]},${v2}` in map) d = vs2[1][0];
    if (`${vs2[1][1]},${v2}` in map) d = vs2[1][1];
  } else if (vs2[1].includes(v1)) {
    if (`${vs2[0][0]},${v2}` in map) d = vs2[0][0];
    if (`${vs2[0][1]},${v2}` in map) d = vs2[0][1];
  }
  if (d === null) {
    console.error("d === null");
    return null;
  }

  if (b !== d) return null;
  return b;
}

/**
 * Gets the c vertices to pass through when searching for the next vertex in the v1 -> v2 direction.
 *
 * @param {{[k:string]:Array<Array<number>>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {number} v1 - The first vertex of the edge.
 * @param {number} v2 - The second vertex of the edge.
 * @returns {Array<number>} The c vertices.
 */
export function getCs(map, v1, v2) {
  const vs0 = map[`${v1},${v2}`]; // [a,c]
  if (vs0.length !== 2) return null;
  if (vs0[1].length !== 2) return null;
  return vs0[1];
}

/**
 * Gets the a vertices to pass through when searching for the next vertex in the v1 -> v2 direction.
 *
 * @param {{[k:string]:Array<Array<number>>}} map - The remaining vertices map. The key is a string of two vertices.
 * @param {number} v1 - The first vertex of the edge.
 * @param {number} v2 - The second vertex of the edge.
 * @returns {Array<number>} The a vertices.
 */
export function getAs(map, v1, v2) {
  const vs0 = map[`${v1},${v2}`]; // [a,c]
  if (vs0.length !== 2) return null;
  if (vs0[0].length !== 2) return null;
  return vs0[0];
}

/**
 * Get the point.
 *
 * @param {THREE.BufferAttribute} vertices - The results of geometry.getAttribute("position").
 * @param {number} index - The index of the vertex.
 * @returns {THREE.Vector3} The point.
 */
export function getPoint(vertices, index) {
  return new THREE.Vector3(
    vertices.array[3 * index],
    vertices.array[3 * index + 1],
    vertices.array[3 * index + 2]
  );
}
