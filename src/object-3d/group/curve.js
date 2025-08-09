import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Curve2 } from "../../curve/curve-2.js";
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

  const { curvesGeometry, cpsGeometry } = c.createGeometry(folder);

  createCurvesLine(folder, scene, curvesGeometry);
  createCpsGroup(folder, scene, cpsGeometry);

  return group;
}

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {THREE.BufferGeometry} geometry
 * @return {THREE.Group}
 */
function createCurvesLine(gui, scene, geometry) {
  const folder = gui.addFolder("curvesLine");

  const lineMaterial = createLineMaterial(folder, 0x000000);

  const line = new THREE.Line(geometry, lineMaterial);

  scene.add(line);
}

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {THREE.BufferGeometry} geometry
 * @return {THREE.Group}
 */
function createCpsGroup(gui, scene, geometry) {
  const group = new THREE.Group();
  const folder = gui.addFolder("cpsGroup");

  const lineMaterial = createLineMaterial(folder, 0x000000);
  const lineMaterials = Array(geometry.groups.length).fill(lineMaterial);
  const pointsMaterial = createPointsMaterial(folder, 0x000000);

  group.add(new THREE.Line(geometry, lineMaterials));
  group.add(new THREE.Points(geometry, pointsMaterial));

  scene.add(group);
}
