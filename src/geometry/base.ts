import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export async function loadBaseGeometry(): Promise<BufferGeometryWithNPolygonIndices | null> {
  const fileLoader = new THREE.FileLoader();
  const gltfLoader = new GLTFLoader();

  const positionsTxt = await fileLoader
    .loadAsync("/models/base1-22-n-polygon-positions.txt")
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (positionsTxt === null) return null;
  if (typeof positionsTxt !== "string") return null;

  const indicesTxt = await fileLoader
    .loadAsync("/models/base1-22-n-polygon-indices.txt")
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (indicesTxt === null) return null;
  if (typeof indicesTxt !== "string") return null;

  const gltf = await gltfLoader
    .loadAsync("/models/base1-22.glb")
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (gltf === null) return null;
  if (!("geometry" in gltf.scene.children[0])) return null;

  const positions: number[][] = JSON.parse(positionsTxt);
  const indices: number[][] = JSON.parse(indicesTxt);
  const geometry = gltf.scene.children[0]
    .geometry as BufferGeometryWithNPolygonIndices;
  geometry.nPolygonIndices = correctNPolygonIndices(
    positions,
    geometry.getAttribute("position") as THREE.Float32BufferAttribute,
    indices
  );
  return geometry;
}

export type BufferGeometryWithNPolygonIndices = THREE.BufferGeometry &
  Record<"nPolygonIndices", number[][]>;

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
