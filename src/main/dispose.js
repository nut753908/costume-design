/**
 * @param {THREE.Group}
 */
export function disposeRecursively(group) {
  group.children.forEach((g) => {
    if (g.dispose) g.dispose();
    if (g.geometry && g.geometry.dispose) g.geometry.dispose();
    disposeRecursively(g);
  });
}
