import { createEmptyGeometry } from "src/geometry/empty";
import type { ControlPoint2 } from "src/hair-bundle/curve/control-point-2";
import type { ControlPoint3 } from "src/hair-bundle/curve/control-point-3";
import type { Materials } from "src/material/materials";
import * as THREE from "three";

/**
 * @param ms - The materials.
 */
export function createControlPointGroup(
  cp: ControlPoint3 | ControlPoint2,
  ms: Materials
): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Points(geometry, ms.points));
  group.add(new THREE.Line(geometry, ms.line));

  cp.createGeometry(group);

  return group;
}
