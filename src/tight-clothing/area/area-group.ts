import type { Materials } from "src/main/material/materials";
import { createEmptyGeometry } from "src/main/utils";
import * as THREE from "three";
import type { Area } from "./area";

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
