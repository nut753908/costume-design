import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { closeFolder, deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @param {THREE.Plane} plane
 * @return {THREE.PlaneHelper}
 */
export function createPlaneHelper(gui, plane = new THREE.Plane()) {
  const obj = { hex: createColor(0xffff00) };
  const helper = new THREE.PlaneHelper(plane, 0.3, obj.hex);
  helper.visible = false;
  helper._updateSizeCallbacks = [];
  {
    deleteFolder(gui, "THREE.PlaneHelper");
    const folder = gui.addFolder("THREE.PlaneHelper");
    closeFolder(folder);
    folder.add(helper, "size").step(0.01).onChange(uS);
    folder.addColor(obj, "hex").onChange(uH);

    function uS() /* updateSize */ {
      helper._updateSizeCallbacks.forEach((c) => c(helper.size));
    }
    function uH() /* updateHex */ {
      helper.material.color.set(obj.hex);
      helper.children[0].material.color.set(obj.hex);
    }
  }
  return helper;
}
