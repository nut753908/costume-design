import type { GUI } from "lil-gui";
import * as THREE from "three";
import { closeFolder, deleteFolder } from "../main/gui";
import { createColor } from "../math/color";

export function createArrowHelper(gui: GUI): ArrowHelperWithCallbacks {
  const obj = {
    dir: new THREE.Vector3(0, 0, 1),
    origin: new THREE.Vector3(0, 0, 0),
    length: 0.15,
    color: createColor(0xffff00),
  };
  const helper = new THREE.ArrowHelper(
    obj.dir,
    obj.origin,
    obj.length,
    obj.color,
  ) as ArrowHelperWithCallbacks;
  helper.visible = false;
  // These function are set in createPlaneGroup() in ./src/object-3d/group/plane.ts.
  helper._updateLengthCallbacks = [];
  {
    deleteFolder(gui, "THREE.ArrowHelper");
    const folder = gui.addFolder("THREE.ArrowHelper");
    closeFolder(folder);
    folder.add(obj, "length").step(0.01).onChange(uL);
    folder.addColor(obj, "color").onChange(uC);

    function uL() /* updateLength */ {
      helper._updateLengthCallbacks.forEach((c) => c(obj.length));
    }
    function uC() /* updateColor */ {
      helper.setColor(obj.color);
    }
  }
  return helper;
}

export type ArrowHelperWithCallbacks = THREE.ArrowHelper &
  Record<"_updateLengthCallbacks", ((length: number) => void)[]>;
