import * as THREE from "three";

import { Edge } from "../../cross-section/edge.js";
import { EdgeLoop } from "../../cross-section/edge-loop.js";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack.js";
import { createLineGroup } from "./line.js";
import { GUI } from "lil-gui";
import { closeFolder, deleteFolder } from "../../main/gui.js";

/**
 * @param {{[k:number|string]:Edge|EdgeLoop|EdgeLoopStack|THREE.CurvePath|THREE.CatmullRomCurve3}} lines
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createLinesGroup(lines, positions, ms) {
  const group = new THREE.Group();

  Object.entries(lines).forEach(([k, v]) =>
    group.add(createLineGroup(v, positions, ms, k))
  );

  return group;
}

/**
 * @param {GUI} gui
 * @param {THREE.Group} group - The lines group.
 * @param {boolean} [visible=false]
 */
export function setLinesGroupGUI(gui, group, visible = false) {
  deleteFolder(gui, "LinesGroup");
  const folder = gui.addFolder("LinesGroup");
  // closeFolder(folder);
  const gFolder = folder.addFolder("visible");
  group.children.forEach((g) => {
    g.visible = visible;
    gFolder.add(g, "visible").name(g.name);
  });
}
