import * as THREE from "three";

import { GUI } from "lil-gui";

/**
 * @param {GUI} gui
 * @return {THREE.AxesHelper}
 */
export function createAxesHelper(gui) {
  const helper = new THREE.AxesHelper(3);
  {
    const folder = gui.addFolder("THREE.AxesHelper").close();
    folder.add(helper, "visible");
  }
  return helper;
}
