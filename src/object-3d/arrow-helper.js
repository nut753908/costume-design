import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @param {THREE.Vector3} [dir=(0,0,1)]
 * @param {THREE.Vector3} [origin=(0,0,0)]
 * @param {boolean} [isRoot=true]
 * @return {THREE.ArrowHelper}
 */
export function createArrowHelper(
  gui,
  dir = new THREE.Vector3(0, 0, 1),
  origin = new THREE.Vector3(0, 0, 0),
  isRoot = false
) {
  const obj = { length: 0.15, hex: createColor(0xffff00) };
  const helper = new THREE.ArrowHelper(dir, origin, obj.length, obj.hex);
  {
    deleteFolder(gui, "THREE.ArrowHelper");
    const folder = gui.addFolder("THREE.ArrowHelper");
    let dFolder;
    if (isRoot) {
      helper.visible = false;
      folder.add(helper, "visible");
      dFolder = folder.addFolder("dir");
      dFolder.add(dir, "x").step(0.01).onChange(uD);
      dFolder.add(dir, "y").step(0.01).onChange(uD);
      dFolder.add(dir, "z").step(0.01).onChange(uD);
      const oFolder = folder.addFolder("origin");
      oFolder.add(origin, "x").step(0.01).onChange(uO);
      oFolder.add(origin, "y").step(0.01).onChange(uO);
      oFolder.add(origin, "z").step(0.01).onChange(uO);
    }
    folder.add(obj, "length").step(0.01).onChange(uL);
    folder.addColor(obj, "hex").onChange(uH);

    function uD() /* updateDir */ {
      dir.normalize();
      helper.setDirection(dir);
      dFolder.controllers.forEach((c) => c.updateDisplay());
    }
    function uO() /* updateOrigin */ {
      helper.position.copy(origin);
    }
    function uL() /* updateLength */ {
      helper.setLength(obj.length);
    }
    function uH() /* updateHex */ {
      helper.setColor(obj.hex);
    }
  }
  return helper;
}
