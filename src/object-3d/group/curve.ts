import * as THREE from "three";

import { Curve3 } from "../../curve/curve-3";
import { Curve2 } from "../../curve/curve-2";
import { createEmptyGeometry } from "../../geometry/empty";
import { createControlPointGroup } from "./control-point";

/**
 * @param ms - The materials.
 */
export function createCurveGroup(
  c: Curve3 | Curve2,
  ms: { [k1: string]: { [k2: string]: THREE.Material } }
): THREE.Group {
  const group = new THREE.Group();

  group.add(createCurvesLine(c, ms));
  group.add(createCpsGroup(c, ms));

  return group;
}

/**
 * @param ms - The materials.
 */
function createCurvesLine(
  c: Curve3 | Curve2,
  ms: { [k1: string]: { [k2: string]: THREE.Material } }
): THREE.Line {
  const geometry = createEmptyGeometry();

  const line = new THREE.Line(geometry, ms.curve.line);

  c.createGeometry(line);

  return line;
}

/**
 * @param ms - The materials.
 */
function createCpsGroup(
  c: Curve3 | Curve2,
  ms: { [k1: string]: { [k2: string]: THREE.Material } }
): THREE.Group {
  const group = new THREE.Group();

  // This function is used by createGeometry() in ./src/curve/curve-{3,2}.js.
  (c._updateCpsGroup = () => {
    group.children.forEach((g) => {
      g.children.forEach((v) => {
        if ("geometry" in v && v.geometry instanceof THREE.BufferGeometry) {
          v.geometry.dispose();
        }
      });
      g.clear();
    });
    group.clear();

    c.cps.forEach((cp) => group.add(createControlPointGroup(cp, ms)));
  })();

  return group;
}
