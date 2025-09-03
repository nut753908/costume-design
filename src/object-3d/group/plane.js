import * as THREE from "three";

import { FreePlane } from "../../cross-section/free-plane.js";
import { VerticalPlane } from "../../cross-section/vertical-plane.js";
import { deleteFolder } from "../../main/gui.js";
import { createPlaneHelper } from "../plane-helper.js";
import { createArrowHelper } from "../arrow-helper.js";

/**
 * @param {GUI} gui
 * @param {FreePlane|VerticalPlane} plane
 * @param {string} name - The folder name.
 * @return {THREE.Group}
 */
export function createPlaneGroup(gui, plane, name = "Plane") {
  deleteFolder(gui, name);
  const folder = gui.addFolder(name);

  const obj = {
    plane: plane.getPlane(),
    normal: plane.getNormal(),
    point: plane.getPoint(),
  };

  const group = new THREE.Group();

  group.add(createPlaneHelper(folder, obj.plane, false));
  group.add(createArrowHelper(folder, obj.normal, obj.point, false));

  return group;
}
