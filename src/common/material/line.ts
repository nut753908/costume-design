import type { GUI } from "lil-gui";
import * as THREE from "three";
import { createColor } from "../utils";

/**
 * @param name - The folder name.
 */
export function createLineMaterial(
  gui: GUI,
  name = "lineMaterial",
  colorHex = 0xffffff,
  hideFolder = false
): THREE.LineBasicMaterial {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: createColor(colorHex),
    transparent: true,
    opacity: 1,
  });
  {
    const folder = gui.addFolder(name);
    folder.addColor(lineMaterial, "color");
    folder.add(lineMaterial, "opacity", 0, 1, 0.01);
    if (hideFolder) folder.hide();
  }
  return lineMaterial;
}
