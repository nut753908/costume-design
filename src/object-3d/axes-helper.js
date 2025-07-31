import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

/**
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @return {THREE.AxesHelper}
 */
export function createAxesHelper(gui, scene) {
  const helper = new THREE.AxesHelper(3);
  {
    const folder = gui.addFolder("THREE.AxesHelper");
    folder.add(helper, "visible");
  }
  scene.add(helper);
  return helper;
}
