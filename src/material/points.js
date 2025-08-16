import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color.js";

/**
 * @param {GUI} gui
 * @param {string} name - The folder name.
 * @param {number} colorHex
 * @return {THREE.PointsMaterial}
 */
export function createPointsMaterial(
  gui,
  name = "pointsMaterial",
  colorHex = 0xffffff
) {
  const pointsMaterial = new THREE.PointsMaterial({
    color: createColor(colorHex),
    size: 5,
    transparent: true,
    opacity: 1,
  });
  {
    const folder = gui.addFolder(name);
    folder.addColor(pointsMaterial, "color");
    folder.add(pointsMaterial, "size", 0, 10, 0.01);
    folder.add(pointsMaterial, "opacity", 0, 1, 0.01);
  }
  return pointsMaterial;
}
