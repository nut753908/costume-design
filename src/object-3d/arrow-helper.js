import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { closeFolder, deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @param {THREE.Vector3} [dir=(0,0,1)]
 * @param {THREE.Vector3} [origin=(0,0,0)]
 * @return {THREE.ArrowHelper}
 */
export function createArrowHelper(
  gui,
  dir = new THREE.Vector3(0, 0, 1),
  origin = new THREE.Vector3(0, 0, 0)
) {
  const obj = { length: 0.15, hex: createColor(0xffff00) };
  const helper = new THREE.ArrowHelper(dir, origin, obj.length, obj.hex);
  helper.visible = false;
  helper._updateLengthCallbacks = [];
  {
    deleteFolder(gui, "THREE.ArrowHelper");
    const folder = gui.addFolder("THREE.ArrowHelper");
    closeFolder(folder);
    folder.add(obj, "length").step(0.01).onChange(uL);
    folder.addColor(obj, "hex").onChange(uH);

    function uL() /* updateLength */ {
      helper._updateLengthCallbacks.forEach((c) => c(obj.length));
    }
    function uH() /* updateHex */ {
      helper.setColor(obj.hex);
    }
  }
  return helper;
}
