import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

/**
 * @return {Promise<?THREE.BufferGeometry>}
 */
export async function loadBaseGeometry() {
  let loader = new GLTFLoader();
  const gltf = await loader
    .loadAsync("../../models/base1-22.glb")
    .catch((error) => console.error(error));
  if (!gltf) return null;

  loader = new THREE.FileLoader();
  const indices = await loader
    .setResponseType("json")
    .loadAsync("../../models/base1-22-n-polygon-indices.txt")
    .catch((error) => console.error(error));
  if (!indices) return null;

  loader = new THREE.FileLoader();
  const positions = await loader
    .setResponseType("json")
    .loadAsync("../../models/base1-22-n-polygon-positions.txt")
    .catch((error) => console.error(error));
  if (!positions) return null;

  const geometry = gltf.scene.children[0].geometry;
  geometry.nPolygonIndices = correctNPolygonIndices(
    positions,
    geometry.getAttribute("position"),
    indices
  );
  return geometry;
}

/**
 * Create the correct n polygon indices.
 *
 * @param {Array<Array<number>>} nPolygonPositions - The n polygon positions.
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<Array<number>>} The correct n polygon indices.
 */
function correctNPolygonIndices(nPolygonPositions, positions, nPolygonIndices) {
  const EPS = Number.EPSILON;
  const map = Array(nPolygonPositions.length);
  for (let i = 0, l1 = nPolygonPositions.length; i < l1; i++) {
    for (let j = 0, l2 = positions.count * 3; j < l2; j += 3) {
      if (
        Math.abs(positions.array[j] - nPolygonPositions[i][0]) < EPS &&
        Math.abs(positions.array[j + 1] - nPolygonPositions[i][2]) < EPS &&
        Math.abs(positions.array[j + 2] + nPolygonPositions[i][1]) < EPS
      ) {
        map[i] = j / 3; // note: one i may have many j/3.
        break;
      }
    }
  }
  return nPolygonIndices
    .map((list) => list.map((v) => map[v]))
    .filter((list) => !list.includes(undefined));
}
