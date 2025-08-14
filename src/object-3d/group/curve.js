import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Curve3 } from "../../curve/curve-3.js";
import { Curve2 } from "../../curve/curve-2.js";
import { createEmptyGeometry } from "../../geometry/empty.js";

/**
 * @param {GUI} gui
 * @param {Curve3|Curve2} c
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @param {string} cName - The curve name used in the folder name.
 * @param {boolean} visible - Whether the curve is visible.
 * @param {boolean} isClose - Whether to close the folder.
 * @param {boolean} isCSetGUI - Whether to enable c.setGUI().
 * @return {THREE.Group}
 */
export function createCurveGroup(
  gui,
  c,
  ms,
  cName = "",
  visible = true,
  isClose = false,
  isCSetGUI = true
) {
  const group = new THREE.Group();
  const folder = gui.addFolder(`curveGroup ${cName}`);

  group.visible = visible;
  folder.add(group, "visible");
  if (isClose) folder.close();

  group.add(createCurvesLine(c, ms));
  group.add(createCpsGroup(c, ms));

  if (isCSetGUI) c.setGUI(folder);

  return group;
}

/**
 * @param {Curve3|Curve2} c
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
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
 * @param {{[string]:{[string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
function createCpsGroup(c, ms) {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  // This function is used by createGeometry() in ./src/curve/curve-{3,2}.js.
  (c._updateCpsGroup = () => {
    group.children.forEach((g) => {
      g.children.forEach((v) => v.geometry.dispose());
      g.clear();
    });
    group.clear();

    c.cps.forEach((cp) => {
      const g = new THREE.Group();

      g.add(new THREE.Points(geometry, ms.cp.points));
      g.add(new THREE.Line(geometry, ms.cp.line));

      cp.createGeometry(g);

      group.add(g);
    });
  })();

  return group;
}
