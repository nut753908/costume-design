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
    const folder = gui.addFolder("toonMaterial");
    {
      const uFolder = folder.addFolder("uniforms");
      const u = toonMaterial.uniforms;
      uFolder.add(u.checkShape, "value").name("checkShape");
      {
        const lpFolder = uFolder.addFolder("lightPos");
        lpFolder.add(u.lightPos.value, "x", -10, 10, 1);
        lpFolder.add(u.lightPos.value, "y", -10, 10, 1);
        lpFolder.add(u.lightPos.value, "z", -10, 10, 1);
      }
      uFolder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
      uFolder.addColor(u.baseColor, "value").name("baseColor");
      uFolder.addColor(u.shadeColor, "value").name("shadeColor");
    }
  }
  return toonMaterial;
}
