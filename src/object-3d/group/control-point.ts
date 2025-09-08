import * as THREE from "three";

import type { ControlPoint3 } from "../../curve/control-point-3";
import type { ControlPoint2 } from "../../curve/control-point-2";
import { createEmptyGeometry } from "../../geometry/empty";

/**
 * @param ms - The materials.
 */
export function createControlPointGroup(
  cp: ControlPoint3 | ControlPoint2,
  ms: { [k1: string]: { [k2: string]: THREE.Material } },
): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Points(geometry, ms.cp.points));
  group.add(new THREE.Line(geometry, ms.cp.line));

  cp.createGeometry(group);

  return group;
}
