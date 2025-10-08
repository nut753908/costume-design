import * as THREE from "three";
import type { Materials } from "../materials";
import { loadBodyGeometry } from "./body-geometry";

/**
 * @param ms - The materials.
 */
export async function createBodyGroup(
  ms: Materials
): Promise<THREE.Group | null> {
  const group = new THREE.Group();

  const geometry = await loadBodyGeometry();
  if (!geometry) return null;

  group.add(new THREE.Mesh(geometry, ms.body));

  return group;
}
