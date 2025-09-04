import * as THREE from "three";

import { FreePlane } from "../../cross-section/free-plane.js";
import { VerticalPlane } from "../../cross-section/vertical-plane.js";
import { deleteFolder } from "../../main/gui.js";
import { createPlaneGroup } from "./plane.js";

/**
 * @param {GUI} gui
 * @param {Array<FreePlane|VerticalPlane>} planes
 * @param {THREE.PlaneHelper} planeHelper
 * @param {THREE.ArrowHelper} arrowHelper
 * @return {THREE.Group}
 */
export function createPlanesGroup(gui, planes, planeHelper, arrowHelper) {
  deleteFolder(gui, "Planes");
  const folder = gui.addFolder("Planes");

  const group = new THREE.Group();

  planes.forEach((plane, i) =>
    group.add(createPlaneGroup(folder, plane, planeHelper, arrowHelper, `${i}`))
  );

  return group;
}
