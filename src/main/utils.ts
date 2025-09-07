import * as THREE from "three";

/**
 * Dispose groups recursively. Materials are not explicitly disposed of.
 */
export function disposeGroup(group: THREE.Group | THREE.Object3D) {
  group.children.forEach((g) => {
    // FIXME:
    if (g.dispose) g.dispose();
    if (g.geometry && g.geometry.dispose) g.geometry.dispose();
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
export function objectMap<Value, NewValue>(
  obj: { [k: string]: Value },
  func: (v: Value) => NewValue
): { [k: string]: NewValue } {
  return Object.fromEntries(
    Object.entries<Value>(obj).map(([k, v]) => [k, func(v)])
  );
}
