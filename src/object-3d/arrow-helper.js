import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { deleteFolder, closeFolder } from "../main/gui";

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
  const obj = {
    dir: dir,
    origin: origin,
    length: 1,
    hex: createColor(0xffff00),
  };
  const helper = new THREE.ArrowHelper(
    obj.dir,
    obj.origin,
    obj.length,
    obj.hex
  );
  {
    deleteFolder(gui, "THREE.ArrowHelper");
    const folder = gui.addFolder("THREE.ArrowHelper");
    closeFolder(folder);
    folder.add(helper, "visible");
    const dFolder = folder.addFolder("dir");
    dFolder
      .add(obj.dir, "x")
      .step(0.01)
      .onChange(() => helper.setDirection(obj.dir));
    dFolder
      .add(obj.dir, "y")
      .step(0.01)
      .onChange(() => helper.setDirection(obj.dir));
    dFolder
      .add(obj.dir, "z")
      .step(0.01)
      .onChange(() => helper.setDirection(obj.dir));
    const oFolder = folder.addFolder("origin");
    oFolder
      .add(obj.origin, "x")
      .step(0.01)
      .onChange((v) => (helper.position.x = v));
    oFolder
      .add(obj.origin, "y")
      .step(0.01)
      .onChange((v) => (helper.position.y = v));
    oFolder
      .add(obj.origin, "z")
      .step(0.01)
      .onChange((v) => (helper.position.z = v));
    folder
      .add(obj, "length")
      .step(0.01)
      .onChange((v) => helper.setLength(v));
    folder.addColor(obj, "hex").onChange((v) => helper.setColor(v));
  }
  return helper;
}
