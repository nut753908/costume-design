import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../math/color.js";

/**
 * @param {GUI} gui
 * @param {string} name - The folder name.
 * @param {number} colorHex
 * @param {number} opacity
 * @return {THREE.LineBasicMaterial}
 */
export function createLineMaterial(
  gui,
  name = "lineMaterial",
  colorHex = 0xffffff,
  opacity = 1
) {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: createColor(colorHex),
    transparent: true,
    opacity: opacity,
  });
  {
    const folder = gui.addFolder(name);
    folder.addColor(lineMaterial, "color");
    folder.add(lineMaterial, "opacity", 0, 1, 0.01);
  }
  return lineMaterial;
}
