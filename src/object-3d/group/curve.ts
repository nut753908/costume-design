import * as THREE from "three";

import { Curve3 } from "../../curve/curve-3";
import { Curve2 } from "../../curve/curve-2";
import { createEmptyGeometry } from "../../geometry/empty";
import { createControlPointGroup } from "./control-point";

/**
 * @param {Curve3|Curve2} c
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createCurveGroup(c, ms) {
  const group = new THREE.Group();

  group.add(createCurvesLine(c, ms));
  group.add(createCpsGroup(c, ms));

  return group;
}

/**
 * @param {Curve3|Curve2} c
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
function createCurvesLine(c, ms) {
  const geometry = createEmptyGeometry();

  const line = new THREE.Line(geometry, ms.curve.line);

  c.createGeometry(line);

  return line;
}

/**
 * @param {Curve3|Curve2} c
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
function createCpsGroup(c, ms) {
  const group = new THREE.Group();

  // This function is used by createGeometry() in ./src/curve/curve-{3,2}.js.
  (c._updateCpsGroup = () => {
    group.children.forEach((g) => {
      g.children.forEach((v) => v.geometry.dispose());
      g.clear();
    });
    group.clear();

    c.cps.forEach((cp) => group.add(createControlPointGroup(cp, ms)));
  })();

  return group;
}
