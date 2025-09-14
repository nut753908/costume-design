import type { GUI } from "lil-gui";
import type { ArrowHelperWithCallbacks } from "src/arrow-helper";
import type { FreePlane } from "src/cross-section/free-plane";
import type { VerticalPlane } from "src/cross-section/vertical-plane";
import { deleteFolder } from "src/main/gui";
import type { PlaneHelperWithCallbacks } from "src/plane-helper";
import * as THREE from "three";
import { createPlaneGroup } from "./plane";

export function createPlanesGroup(
  gui: GUI,
  planes: { [k: string]: FreePlane | VerticalPlane },
  planeHelper: PlaneHelperWithCallbacks,
  arrowHelper: ArrowHelperWithCallbacks
): THREE.Group {
  deleteFolder(gui, "PlanesGroup");
  const folder = gui.addFolder("PlanesGroup");

  const group = new THREE.Group();

  Object.entries(planes).forEach(([k, v]) => {
    group.add(createPlaneGroup(folder, v, planeHelper, arrowHelper, k));
  });

  return group;
}
