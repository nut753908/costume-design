import * as THREE from "three";

/**
 * Dispose groups recursively. Materials are not explicitly disposed of.
 */
export function disposeGroup(group: THREE.Group | THREE.Object3D) {
  group.children.forEach((g) => {
    if ("dispose" in g && g.dispose instanceof Function) {
      g.dispose();
    }
    if ("geometry" in g && g.geometry instanceof THREE.BufferGeometry) {
      g.geometry.dispose();
    }
    disposeGroup(g);
  });
}

/**
 * Call the function on every value in the object and create a new object from the results.
 *
 * @param obj - The object.
 * @param func - The function.
 * @return  A new Object.
 */
export function objectMap<V, NewV>(
  obj: { [k: string]: V },
  func: (v: V) => NewV
): { [k: string]: NewV } {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}

/**
 * Create a color using THREE.LinearSRGBColorSpace.
 * @param hex - The color hex.
 */
export function createColor(hex: number): THREE.Color {
  return new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);
}
