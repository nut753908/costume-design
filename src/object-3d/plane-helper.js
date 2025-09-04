import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @param {THREE.Plane} plane
 * @param {boolean} [isRoot=true]
 * @return {THREE.PlaneHelper}
 */
export function createPlaneHelper(
  gui,
  plane = new THREE.Plane(),
  isRoot = true
) {
  const obj = { hex: createColor(0xffff00) };
  const helper = new THREE.PlaneHelper(plane, 1, obj.hex);
  {
    deleteFolder(gui, "THREE.PlaneHelper");
    const folder = gui.addFolder("THREE.PlaneHelper");
    let nFolder;
    if (isRoot) {
      helper.visible = false;
      folder.add(helper, "visible");
      nFolder = folder.addFolder("normal");
      nFolder.add(plane.normal, "x").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "y").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "z").step(0.01).onChange(uN);
      folder.add(plane, "constant").step(0.01);
    }
    folder.add(helper, "size").step(0.01);
    folder.addColor(obj, "hex").onChange(uH);

    function uN() /* updateNormal */ {
      plane.normal.normalize();
      nFolder.controllers.forEach((c) => c.updateDisplay());
    }
    function uH() /* updateHex */ {
      helper.material.color.set(obj.hex);
      helper.children[0].material.color.set(obj.hex);
    }
  }
  return helper;
}
