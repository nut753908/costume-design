import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { LimitedTube } from "../../curve/limited-tube.js";
import { createCurveGroup } from "./curve.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createToonMaterial } from "../../material/toon.js";

/**
 * @param {GUI} gui
 * @param {LimitedTube} lt
 * @return {THREE.Group}
 */
export function createLimitedTubeGroup(gui, lt) {
  const group = new THREE.Group();
  const folder = gui.addFolder("limitedTubeGroup");

  const p = lt.parameters;

  group.add(createFacesGroup(folder, lt));
  group.add(createCurveGroup(folder, p.axis, "axis", false, false));
  group.add(createCurveGroup(folder, p.cross, "cross", false, false));
  group.add(createCurveGroup(folder, p.scaleC, "scaleC", false, false));
  group.add(createCurveGroup(folder, p.xScaleC, "xScaleC", false, false));
  group.add(createCurveGroup(folder, p.yScaleC, "yScaleC", false, false));
  group.add(createCurveGroup(folder, p.tiltC, "tiltC", false, false));

  lt.setGUI(folder);

  return group;
}

/**
 * @param {GUI} gui
 * @param {LimitedTube} lt
 * @param {boolean} visible
 * @return {THREE.Group}
 */
function createFacesGroup(gui, lt, visible = true) {
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

  lt.createGeometry(group);

  return group;
}
