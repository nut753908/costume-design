import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../sub/color.js";

/**
 * @param {GUI} gui
 * @return {THREE.LineBasicMaterial}
 */
export function createLineMaterial(gui, opacity = 0) {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: createColor(0xffffff),
    transparent: true,
    opacity: opacity,
  });
  {
    const folder = gui.addFolder("lineMaterial");
    folder.addColor(lineMaterial, "color");
    folder.add(lineMaterial, "opacity", 0, 1, 0.1);
  }
  return lineMaterial;
}
