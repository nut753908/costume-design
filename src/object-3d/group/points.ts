import type { Materials } from "src/material/materials";
import * as THREE from "three";

/**
 * @param ms - The materials.
 * @param name - The group name.
 */
export function createPointsGroup(
  points: THREE.Vector3[] | THREE.Vector2[],
  ms: Materials,
  name: string
): THREE.Group {
  const group = new THREE.Group();
  group.name = name;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  group.add(new THREE.Points(geometry, ms.line.points));

  return group;
}
