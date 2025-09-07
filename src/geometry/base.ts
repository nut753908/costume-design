import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export async function loadBaseGeometry(): Promise<THREE.BufferGeometry | null> {
  const gltfLoader = new GLTFLoader();
  const fileLoader = new THREE.FileLoader();

  const gltf = await gltfLoader
    .loadAsync("../../models/base1-22.glb")
    .catch((error) => console.error(error));
  if (!gltf) return null;

  const indices = await fileLoader
    .setResponseType("json")
    .loadAsync("../../models/base1-22-n-polygon-indices.txt")
    .catch((error) => console.error(error));
  if (!indices) return null;

  const positions = await fileLoader
    .setResponseType("json")
    .loadAsync("../../models/base1-22-n-polygon-positions.txt")
    .catch((error) => console.error(error));
  if (!positions) return null;

  // FIXME:
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
 * @param nPolygonPositions - The n polygon positions.
 * @param positions - The results of geometry.getAttribute("position").
 * @param nPolygonIndices - The n polygon indices.
 * @return  The correct n polygon indices.
 */
function correctNPolygonIndices(
  nPolygonPositions: number[][],
  positions: THREE.BufferAttribute,
  nPolygonIndices: number[][]
): number[][] {
  const EPS = Number.EPSILON;
  const map: (number | undefined)[] = Array(nPolygonPositions.length);
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
    .filter((list) => !list.includes(undefined)) as number[][];
}
