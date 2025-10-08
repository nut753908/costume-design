import type { Materials } from "src/common/material/materials";
import { createEmptyGeometry } from "src/common/utils";
import * as THREE from "three";
import type { Area } from "./area";

/**
 * @param bodyGeometry - The body geometry.
 * @param ms - The materials.
 */
export function createAreaGroup(
  area: Area,
  bodyGeometry: THREE.BufferGeometry,
  ms: Materials
): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Mesh(geometry, ms.toon.area));

  area.createAreaGroup(bodyGeometry, group);

  return group;
}
