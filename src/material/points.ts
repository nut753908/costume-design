import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";

/**
 * @param name - The folder name.
 */
export function createPointsMaterial(
  gui: GUI,
  name = "pointsMaterial",
  colorHex = 0xffffff
): THREE.PointsMaterial {
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
