import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { closeFolder, deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @return {THREE.PlaneHelper}
 */
export function createPlaneHelper(gui) {
  const obj = {
    plane: new THREE.Plane(),
    size: 0.3,
    hex: createColor(0xffff00),
  };
  const helper = new THREE.PlaneHelper(obj.plane, obj.size, obj.hex);
  helper.visible = false;
  // These function are set in createPlaneGroup() in ./src/object-3d/group/plane.js.
  helper._updateSizeCallbacks = [];
  {
    deleteFolder(gui, "THREE.PlaneHelper");
    const folder = gui.addFolder("THREE.PlaneHelper");
    closeFolder(folder);
    folder.add(obj, "size").step(0.01).onChange(uS);
    folder.addColor(obj, "hex").onChange(uH);

    function uS() /* updateSize */ {
      helper._updateSizeCallbacks.forEach((c) => c(obj.size));
    }
    function uH() /* updateHex */ {
      helper.material.color.set(obj.hex);
      helper.children[0].material.color.set(obj.hex);
    }
  }
  return helper;
}
