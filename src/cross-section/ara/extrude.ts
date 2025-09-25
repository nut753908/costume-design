import * as THREE from "three";

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
