import * as THREE from "three";

import { loadBaseGeometry } from "../../geometry/base.js";

/**
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @return {?THREE.Group}
 */
export async function createBaseGroup(ms) {
  const group = new THREE.Group();

  const geometry = await loadBaseGeometry();
  if (!geometry) return null;

  group.add(new THREE.LineSegments(geometry, ms.base.line));
  group.add(new THREE.Mesh(geometry, ms.base.toon));

  return group;
}
