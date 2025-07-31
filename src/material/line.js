import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../sub/color.js";

/**
 * @param {GUI} folder
 * @return {THREE.LineBasicMaterial}
 */
export function createLineMaterial(folder) {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: createColor(0xffffff),
    transparent: true,
    opacity: 1,
  });
  {
    const lmFolder = folder.addFolder("lineMaterial");
    lmFolder.addColor(lineMaterial, "color");
    lmFolder.add(lineMaterial, "opacity", 0, 1, 0.1);
  }
  return lineMaterial;
}
