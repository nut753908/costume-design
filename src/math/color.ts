import * as THREE from "three";

export function createColor(hex: number): THREE.Color {
  return new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);
}
