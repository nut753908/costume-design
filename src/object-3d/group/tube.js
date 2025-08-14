import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Tube } from "../../curve/tube.js";
import { createCurveGroup } from "./curve.js";
import { createEmptyGeometry } from "../../geometry/empty.js";

/**
 * @param {GUI} gui
 * @param {Tube} t
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createTubeGroup(gui, t, ms) {
  const group = new THREE.Group();
  const folder = gui.addFolder("TubeGroup");

  const p = t.parameters;

  group.add(createFacesGroup(folder, t, ms));
  const bools = [false, true, false];
  group.add(createCurveGroup(folder, p.axis, ms, "axis", ...bools));
  group.add(createCurveGroup(folder, p.cross, ms, "cross", ...bools));
  group.add(createCurveGroup(folder, p.scaleC, ms, "scaleC", ...bools));
  group.add(createCurveGroup(folder, p.xScaleC, ms, "xScaleC", ...bools));
  group.add(createCurveGroup(folder, p.yScaleC, ms, "yScaleC", ...bools));
  group.add(
    createCurveGroup(folder, p.xCurvatureC, ms, "xCurvatureC", ...bools)
  );
  group.add(
    createCurveGroup(folder, p.yCurvatureC, ms, "yCurvatureC", ...bools)
  );
  group.add(createCurveGroup(folder, p.tiltC, ms, "tiltC", ...bools));

  t.setGUI(folder);

  return group;
}

/**
 * @param {GUI} gui
 * @param {Tube} t
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @param {boolean} visible
 * @return {THREE.Group}
 */
function createFacesGroup(gui, t, ms, visible = true) {
  const group = new THREE.Group();
  const folder = gui.addFolder("facesGroup");

  group.visible = visible;
  folder.add(group, "visible");

  const emptyGeometry = createEmptyGeometry();

  group.add(new THREE.LineSegments(emptyGeometry, ms.tube.line));
  group.add(new THREE.Mesh(emptyGeometry, ms.tube.toon));

  t.createGeometry(group);

  return group;
}
