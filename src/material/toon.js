import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color.js";

/**
 * @param {GUI} gui
 * @param {string} name - The folder name.
 * @param {number} baseColorHex
 * @param {number} shadeColorHex
 * @param {THREE.Side} side
 * @return {THREE.ShaderMaterial}
 */
export function createToonMaterial(
  gui,
  name = "toonMaterial",
  baseColorHex = 0xfcd7e9,
  shadeColorHex = 0xf8c1de,
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
    const folder = gui.addFolder(`${name} (u=uniforms)`);
    folder.add(toonMaterial, "wireframe");
    const u = toonMaterial.uniforms;
    folder.add(u.checkShape, "value").name("u.checkShape");
    folder.add(u.lightPos.value, "x").step(0.1).name("u.light.x");
    folder.add(u.lightPos.value, "y").step(0.1).name("u.light.y");
    folder.add(u.lightPos.value, "z").step(0.1).name("u.light.z");
    folder.add(u.threshold, "value", 0, 1, 0.01).name("u.threshold");
    folder.addColor(u.baseColor, "value").name("u.baseColor");
    folder.addColor(u.shadeColor, "value").name("u.shadeColor");
  }
  return toonMaterial;
}
