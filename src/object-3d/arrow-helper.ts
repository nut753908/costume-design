import type { GUI } from "lil-gui";
import { closeFolder, deleteFolder } from "src/main/gui";
import { createColor } from "src/math/color";
import * as THREE from "three";

export function createArrowHelper(gui: GUI): ArrowHelperWithCallbacks {
  const obj = {
    visible: true,
    dir: new THREE.Vector3(0, 0, 1),
    origin: new THREE.Vector3(0, 0, 0),
    length: 0.15,
    color: createColor(0xffff00),
  };
  const helper = new THREE.ArrowHelper(
    obj.dir,
    obj.origin,
    obj.length,
    obj.color
  ) as ArrowHelperWithCallbacks;
  // These function are set in createGroup() in src/cross-section/plane/plane.ts.
  helper._updateVisibleCallbacks = [];
  helper._updateLengthCallbacks = [];
  {
    deleteFolder(gui, "THREE.ArrowHelper");
    const folder = gui.addFolder("THREE.ArrowHelper");
    closeFolder(folder);
    folder.add(obj, "visible").onChange(uV);
    folder.add(obj, "length").step(0.01).onChange(uL);
    folder.addColor(obj, "color").onChange(uC);

    function uV() /* updateVisible */ {
      helper._updateVisibleCallbacks.map((c) => c(obj.visible));
    }
    function uL() /* updateLength */ {
      helper._updateLengthCallbacks.map((c) => c(obj.length));
    }
    function uC() /* updateColor */ {
      helper.setColor(obj.color);
    }
  }
  return helper;
}

export type ArrowHelperWithCallbacks = THREE.ArrowHelper &
  Record<"_updateVisibleCallbacks", ((visible: boolean) => void)[]> &
  Record<"_updateLengthCallbacks", ((length: number) => void)[]>;
