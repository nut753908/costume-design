import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Tube } from "../../curve/tube.js";
import { createCurveGroup } from "./curve.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createToonMaterial } from "../../material/toon.js";

/**
 * @param {GUI} gui
 * @param {Tube} t
 * @return {THREE.Group}
 */
export function createTubeGroup(gui, t) {
  const group = new THREE.Group();
  const folder = gui.addFolder("TubeGroup");

  const p = t.parameters;

  group.add(createFacesGroup(folder, t));
  const bools = [false, true, false];
  group.add(createCurveGroup(folder, p.axis, "axis", ...bools));
  group.add(createCurveGroup(folder, p.cross, "cross", ...bools));
  group.add(createCurveGroup(folder, p.scaleC, "scaleC", ...bools));
  group.add(createCurveGroup(folder, p.xScaleC, "xScaleC", ...bools));
  group.add(createCurveGroup(folder, p.yScaleC, "yScaleC", ...bools));
  group.add(createCurveGroup(folder, p.xCurvatureC, "xCurvatureC", ...bools));
  group.add(createCurveGroup(folder, p.yCurvatureC, "yCurvatureC", ...bools));
  group.add(createCurveGroup(folder, p.tiltC, "tiltC", ...bools));

  t.setGUI(folder);

  return group;
}

/**
 * @param {GUI} gui
 * @param {Tube} t
 * @param {boolean} visible
 * @return {THREE.Group}
 */
function createFacesGroup(gui, t, visible = true) {
  const group = new THREE.Group();
  const folder = gui.addFolder("facesGroup");

  group.visible = visible;
  folder.add(group, "visible");

  const emptyGeometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder);
  const toonMaterial = createToonMaterial(
    0xfcd7e9,
    0xf8c1de,
    folder,
    THREE.DoubleSide
  );

  group.add(new THREE.LineSegments(emptyGeometry, lineMaterial));
  group.add(new THREE.Mesh(emptyGeometry, toonMaterial));

  t.createGeometry(group);

  return group;
}
