import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../math/color.js";

/**
 * @param {GUI} gui
 * @return {THREE.Scene}
 */
export function createScene(gui) {
  const scene = new THREE.Scene();
  scene.background = createColor(0xffffff);
  {
    const folder = gui.addFolder("THREE.Scene");
    folder.addColor(scene, "background");
  }
  return scene;
}
