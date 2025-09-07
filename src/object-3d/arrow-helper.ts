import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { closeFolder, deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @return {THREE.ArrowHelper}
 */
export function createArrowHelper(gui) {
  const obj = {
    dir: new THREE.Vector3(0, 0, 1),
    origin: new THREE.Vector3(0, 0, 0),
    length: 0.15,
    hex: createColor(0xffff00),
  };
  const helper = new THREE.ArrowHelper(
    obj.dir,
    obj.origin,
    obj.length,
    obj.hex
  );
  helper.visible = false;
  // These function are set in createPlaneGroup() in ./src/object-3d/group/plane.js.
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
