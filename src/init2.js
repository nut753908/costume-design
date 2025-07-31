import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "./sub/color.js";

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
