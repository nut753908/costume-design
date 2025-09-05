import * as THREE from "three";

import { Edge } from "../../cross-section/edge.js";
import { EdgeLoop } from "../../cross-section/edge-loop.js";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack.js";
import { createEdgeGroup } from "./edge.js";
import { GUI } from "lil-gui";
import { closeFolder, deleteFolder } from "../../main/gui.js";

/**
 * @param {Array<Edge|EdgeLoop|EdgeLoopStack|THREE.CurvePath|THREE.CatmullRomCurve3>} edges - Edges / Edge loops / Edge loop stacks / Line paths / Spline curves
 * @param {THREE.BufferAttribute} positions - The results of geometry.getAttribute("position").
 * @param {{[k1:string]:{[k2:string]:THREE.Material}}} ms - The materials.
 * @return {THREE.Group}
 */
export function createEdgesGroup(edges, positions, ms) {
  const group = new THREE.Group();

  edges.forEach((edge) => group.add(createEdgeGroup(edge, positions, ms)));

  return group;
}

/**
 * @param {GUI} gui
 * @param {THREE.Group} group - The edges group.
 * @param {boolean} [visible=false]
 */
export function setEdgesGroupGUI(gui, group, visible = false) {
  deleteFolder(gui, "EdgesGroup");
  const folder = gui.addFolder("EdgesGroup");
  // closeFolder(folder);
  const gFolder = folder.addFolder("visible");
  group.children.forEach((g, i) => {
    g.visible = visible;
    gFolder.add(g, "visible").name(`${i}`);
  });
}
