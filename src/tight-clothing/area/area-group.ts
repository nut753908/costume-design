import { createEmptyGeometry } from "src/main/utils";
import type { Materials } from "src/material/materials";
import type { Area } from "src/tight-clothing/area/area";
import * as THREE from "three";

/**
 * @param baseGeometry - The base geometry.
 * @param ms - The materials.
 */
export function createAreaGroup(
  area: Area,
  baseGeometry: THREE.BufferGeometry,
  ms: Materials
): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Mesh(geometry, ms.toon.area));

  area.createAreaGroup(baseGeometry, group);

  return group;
}
