import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../sub/color.js";
import { getToonVertex, getToonFragment } from "../sub/shader.js";

/**
 * @param {THREE.Color} baseColorHex
 * @param {THREE.Color} shadeColorHex
 * @param {GUI} gui
 * @param {THREE.Side} side
 * @return {THREE.ShaderMaterial}
 */
export function createToonMaterial(
  baseColorHex,
  shadeColorHex,
  gui,
  side = THREE.FrontSide
) {
  const toonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      checkShape: { value: false },
      lightPos: { value: new THREE.Vector3(-5, 5, 5) },
      threshold: { value: 0.5 },
      baseColor: { value: createColor(baseColorHex) },
      shadeColor: { value: createColor(shadeColorHex) },
    },
    uniformsNeedUpdate: true,
    vertexShader: getToonVertex(),
    fragmentShader: getToonFragment(),
    side: side,
  });
  {
    const folder = gui.addFolder("toonMaterial.uniforms");
    const u = toonMaterial.uniforms;
    folder.add(u.checkShape, "value").name("checkShape");
    folder.add(u.lightPos.value, "x", -10, 10, 1).name("light.x");
    folder.add(u.lightPos.value, "y", -10, 10, 1).name("light.y");
    folder.add(u.lightPos.value, "z", -10, 10, 1).name("light.z");
    folder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
    folder.addColor(u.baseColor, "value").name("baseColor");
    folder.addColor(u.shadeColor, "value").name("shadeColor");
  }
  return toonMaterial;
}
