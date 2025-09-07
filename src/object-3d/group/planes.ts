import * as THREE from "three";

import { GUI } from "lil-gui";
import { FreePlane } from "../../cross-section/free-plane";
import { VerticalPlane } from "../../cross-section/vertical-plane";
import { deleteFolder } from "../../main/gui";
import { createPlaneGroup } from "./plane";

export function createPlanesGroup(
  gui: GUI,
  planes: { [k: number | string]: FreePlane | VerticalPlane },
  planeHelper: THREE.PlaneHelper, // TODO: later, change the type from THREE.PlaneHelper to PlaneHelper.
  arrowHelper: THREE.ArrowHelper
): THREE.Group {
  deleteFolder(gui, "PlanesGroup");
  const folder = gui.addFolder("PlanesGroup");

  const group = new THREE.Group();

  Object.entries(planes).forEach(([k, v], i) => {
    const name = String(i) !== k ? `[${i}] ${k}` : `[${i}]`;
    group.add(createPlaneGroup(folder, v, planeHelper, arrowHelper, name));
  });

  return group;
}
