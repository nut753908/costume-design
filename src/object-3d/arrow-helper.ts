import type { GUI } from "lil-gui";
import { createColor } from "src/main/utils";
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
  helper._updateVisibleCallbacks = {};
  helper._updateLengthCallbacks = {};
  {
    const folder = gui.addFolder("THREE.ArrowHelper");
    folder.add(obj, "visible").onChange(uV);
    folder.add(obj, "length").step(0.01).onChange(uL);
    folder.addColor(obj, "color").onChange(uC);

    function uV() /* updateVisible */ {
      Object.values(helper._updateVisibleCallbacks).map((c) => c(obj.visible));
    }
    function uL() /* updateLength */ {
      Object.values(helper._updateLengthCallbacks).map((c) => c(obj.length));
    }
    function uC() /* updateColor */ {
      helper.setColor(obj.color);
    }
  }
  return helper;
}

export type ArrowHelperWithCallbacks = THREE.ArrowHelper &
  Record<
    "_updateVisibleCallbacks",
    { [k: string]: (visible: boolean) => void }
  > &
  Record<"_updateLengthCallbacks", { [k: string]: (length: number) => void }>;
