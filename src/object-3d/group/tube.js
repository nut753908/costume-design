import * as THREE from "three";

import { Tube } from "../../curve/tube.js";
import { createCurveGroup } from "./curve.js";
import { createEmptyGeometry } from "../../geometry/empty.js";

/**
 * @param {Tube} t
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createTubeGroup(t, ms) {
  const group = new THREE.Group();

  const p = t.parameters;

  group.add(createFacesGroup(t, ms));
  group.add(createCurveGroup(p.axis, ms));
  group.add(createCurveGroup(p.cross, ms));
  group.add(createCurveGroup(p.scaleC, ms));
  group.add(createCurveGroup(p.xScaleC, ms));
  group.add(createCurveGroup(p.yScaleC, ms));
  group.add(createCurveGroup(p.xCurvatureC, ms));
  group.add(createCurveGroup(p.yCurvatureC, ms));
  group.add(createCurveGroup(p.tiltC, ms));

  return group;
}

/**
 * @param {Tube} t
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
function createFacesGroup(t, ms) {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.LineSegments(geometry, ms.tube.line));
  group.add(new THREE.Mesh(geometry, ms.tube.toon));

  t.createGeometry(group);

  return group;
}
