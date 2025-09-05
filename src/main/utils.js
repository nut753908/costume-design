/**
 * Dispose groups recursively. Materials are not explicitly disposed of.
 *
 * @param {THREE.Group}
 */
export function disposeGroup(group) {
  group.children.forEach((g) => {
    if (g.dispose) g.dispose();
    if (g.geometry && g.geometry.dispose) g.geometry.dispose();
    disposeGroup(g);
  });
}

/**
 * Call the function on every value in the object and create a new object from the results.
 *
 * @param {Object} obj - The object.
 * @param {Function} func - The function.
 * @return {Object} A new Object.
 */
export function objectMap(obj, func) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}
