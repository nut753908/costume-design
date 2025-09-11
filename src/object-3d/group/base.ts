import type { Materials } from "src/material/materials";
import * as THREE from "three";
import { loadBaseGeometry } from "../../geometry/base";

/**
 * @param ms - The materials.
 */
export async function createBaseGroup(
  ms: Materials
): Promise<THREE.Group | null> {
  const group = new THREE.Group();

  const geometry = await loadBaseGeometry();
  if (!geometry) return null;

  group.add(new THREE.LineSegments(geometry, ms.base.line));
  group.add(new THREE.Mesh(geometry, ms.base.toon));

  return group;
}
