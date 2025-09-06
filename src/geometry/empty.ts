import * as THREE from "three";

/**
 * @return {THREE.BufferGeometry}
 */
export function createEmptyGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
  return geometry;
}
