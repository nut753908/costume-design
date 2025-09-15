import type { GUI } from "lil-gui";
import type { FreePlane } from "src/cross-section/plane/free-plane";
import type { VerticalPlane } from "src/cross-section/plane/vertical-plane";
import { deleteFolder } from "src/main/gui";
import type { ArrowHelperWithCallbacks } from "src/object-3d/arrow-helper";
import type { PlaneHelperWithCallbacks } from "src/object-3d/plane-helper";
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
