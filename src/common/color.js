import * as THREE from "three";

/**
 * @param {number} hex
 */
export function createColor(hex) {
  return new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);
}
