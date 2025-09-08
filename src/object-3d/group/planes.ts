import type { GUI } from "lil-gui";
import * as THREE from "three";
import type { FreePlane } from "../../cross-section/free-plane";
import type { VerticalPlane } from "../../cross-section/vertical-plane";
import { deleteFolder } from "../../main/gui";
import type { ArrowHelperWithCallbacks } from "../arrow-helper";
import type { PlaneHelperWithCallbacks } from "../plane-helper";
import { createPlaneGroup } from "./plane";

export function createPlanesGroup(
  gui: GUI,
  planes: { [k: number | string]: FreePlane | VerticalPlane },
  planeHelper: PlaneHelperWithCallbacks,
  arrowHelper: ArrowHelperWithCallbacks
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
