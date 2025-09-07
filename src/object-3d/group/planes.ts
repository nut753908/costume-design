import * as THREE from "three";

import { FreePlane } from "../../cross-section/free-plane";
import { VerticalPlane } from "../../cross-section/vertical-plane";
import { deleteFolder } from "../../main/gui";
import { createPlaneGroup } from "./plane";

/**
 * @param {GUI} gui
 * @param {{[k:number|string]:FreePlane|VerticalPlane}} planes
 * @param {THREE.PlaneHelper} planeHelper
 * @param {THREE.ArrowHelper} arrowHelper
 * @return {THREE.Group}
 */
export function createPlanesGroup(gui, planes, planeHelper, arrowHelper) {
  deleteFolder(gui, "PlanesGroup");
  const folder = gui.addFolder("PlanesGroup");

  const group = new THREE.Group();

  Object.entries(planes).forEach(([k, v], i) => {
    const name = i !== k ? `[${i}] ${k}` : `[${i}]`;
    group.add(createPlaneGroup(folder, v, planeHelper, arrowHelper, name));
  });

  return group;
}
