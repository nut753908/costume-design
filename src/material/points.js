import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../math/color.js";

/**
 * @param {GUI} gui
 * @param {number} colorHex
 * @param {number} size
 * @param {number} opacity
 * @return {THREE.PointsMaterial}
 */
export function createPointsMaterial(
  gui,
  colorHex = 0xffffff,
  size = 5,
  opacity = 1
) {
  const pointsMaterial = new THREE.PointsMaterial({
    color: createColor(colorHex),
    size: size,
    transparent: true,
    opacity: opacity,
  });
  {
    const folder = gui.addFolder("pointsMaterial");
    folder.addColor(pointsMaterial, "color");
    folder.add(pointsMaterial, "size", 0, 10, 0.1);
    folder.add(pointsMaterial, "opacity", 0, 1, 0.1);
  }
  return pointsMaterial;
}
