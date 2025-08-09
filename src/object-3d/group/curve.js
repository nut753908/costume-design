import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Curve2 } from "../../curve/curve-2.js";
import { createEmptyGeometry } from "../../geometry/empty.js";
import { createLineMaterial } from "../../material/line.js";
import { createPointsMaterial } from "../../material/points.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {Curve2} c
 * @return {THREE.Group}
 */
export function createCurveGroup(gui, scene, c) {
  const group = new THREE.Group();
  const folder = gui.addFolder("curveGroup");

  group.add(createCurvesLine(folder, c));
  group.add(createCpsGroup(folder, c));

  scene.add(group);

  return group;
}

/**
 * @param {GUI} gui
 * @param {Curve2} c
 * @return {THREE.Group}
 */
function createCurvesLine(gui, c) {
  const folder = gui.addFolder("curvesLine");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder, 0x000000);

  const line = new THREE.Line(geometry, lineMaterial);

  c.createGeometry(line, folder);

  return line;
}

/**
 * @param {GUI} gui
 * @param {Curve2} c
 * @return {THREE.Group}
 */
function createCpsGroup(gui, c) {
  const group = new THREE.Group();
  const folder = gui.addFolder("cpsGroup");

  const geometry = createEmptyGeometry();

  const lineMaterial = createLineMaterial(folder, 0x000000);
  // const lineMaterials = Array(geometry.groups.length).fill(lineMaterial);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  c.cps.forEach((cp, i) => {
    const _group = new THREE.Group();

    _group.add(new THREE.Line(geometry, lineMaterial));
    _group.add(new THREE.Points(geometry, pointsMaterial));

    cp.createGeometry(_group, folder, `cps[${i}]`, c._update);

    group.add(_group);
  });

  return group;
}
