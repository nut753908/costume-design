import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";

/**
 * @param name - The folder name.
 */
export function createLineMaterial(
  gui: GUI,
  name = "lineMaterial",
  colorHex = 0xffffff,
  opacity = 1,
): THREE.LineBasicMaterial {
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
