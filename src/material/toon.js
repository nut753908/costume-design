import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createColor } from "../main/color.js";

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
    vertexShader: document.getElementById("toonVertex").textContent,
    fragmentShader: document.getElementById("toonFragment").textContent,
    side: side,
  });
  {
    const folder = gui.addFolder("toonMaterial (u=uniforms)");
    folder.add(toonMaterial, "wireframe");
    const u = toonMaterial.uniforms;
    folder.add(u.checkShape, "value").name("u.checkShape");
    folder.add(u.lightPos.value, "x", -10, 10, 1).name("u.light.x");
    folder.add(u.lightPos.value, "y", -10, 10, 1).name("u.light.y");
    folder.add(u.lightPos.value, "z", -10, 10, 1).name("u.light.z");
    folder.add(u.threshold, "value", 0, 1, 0.1).name("u.threshold");
    folder.addColor(u.baseColor, "value").name("u.baseColor");
    folder.addColor(u.shadeColor, "value").name("u.shadeColor");
  }
  return toonMaterial;
}
