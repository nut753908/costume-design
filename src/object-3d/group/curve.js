import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Curve3 } from "../../curve/curve-3.js";
import { Curve2 } from "../../curve/curve-2.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {Curve3|Curve2} c
 * @param {string} cName - The curve name used in the folder name.
 * @param {boolean} visible
 * @param {boolean} isCSetGUI - Whether to enable c.setGUI().
 * @return {THREE.Group}
 */
export function createCurveGroup(
  gui,
  c,
  cName = "",
  visible = true,
  isCSetGUI = true
) {
  const group = new THREE.Group();
  const folder = gui.addFolder(`curveGroup ${cName}`);

  group.visible = visible;
  folder.add(group, "visible");

  group.add(createCurvesLine(folder, c));
  group.add(createCpsGroup(folder, c));

  if (isCSetGUI) c.setGUI(folder);

  return group;
}

/**
 * @param {GUI} gui
 * @param {Curve3|Curve2} c
 * @return {THREE.Group}
 */
function createCurvesLine(gui, c) {
  const folder = gui.addFolder("curvesLine");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder, 0x000000);

  const line = new THREE.Line(geometry, lineMaterial);

  c.createGeometry(line);

  return line;
}

/**
 * @param {GUI} gui
 * @param {Curve3|Curve2} c
 * @return {THREE.Group}
 */
function createCpsGroup(gui, c) {
  const group = new THREE.Group();
  const folder = gui.addFolder("cpsGroup");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  // This function is used by createGeometry() in ./src/curve/curve-{3,2}.js.
  (c._updateCpsGroup = () => {
    group.children.forEach((g) => {
      g.children.forEach((v) => v.geometry.dispose());
      g.clear();
    });
    group.clear();

    c.cps.forEach((cp) => {
      const g = new THREE.Group();

      g.add(new THREE.Line(geometry, lineMaterial));
      g.add(new THREE.Points(geometry, pointsMaterial));

      cp.createGeometry(g);

      group.add(g);
    });
  })();

  return group;
}
