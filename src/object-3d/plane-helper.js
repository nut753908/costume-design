import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { deleteFolder, closeFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @param {THREE.Plane} plane
 * @return {THREE.PlaneHelper}
 */
export function createPlaneHelper(gui, plane = new THREE.Plane()) {
  const obj = { hex: createColor(0xffff00) };
  const helper = new THREE.PlaneHelper(plane, 1, obj.hex);
  {
    deleteFolder(gui, "THREE.PlaneHelper");
    const folder = gui.addFolder("THREE.PlaneHelper");
    closeFolder(folder);
    folder.add(helper, "visible");
    const nfolder = folder.addFolder("normal");
    nfolder.add(helper.plane.normal, "x").step(0.01);
    nfolder.add(helper.plane.normal, "y").step(0.01);
    nfolder.add(helper.plane.normal, "z").step(0.01);
    folder.add(helper.plane, "constant").step(0.01);
    folder.add(helper, "size").step(0.01);
    folder.addColor(obj, "hex").onChange((v) => {
      helper.material.color.set(v);
      helper.children[0].material.color.set(v);
    });
  }
  return helper;
}
