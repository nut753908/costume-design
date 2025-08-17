/**
 * @param {THREE.Group}
 */
export function disposeGroup(group) {
  group.children.forEach((g) => {
    if (g.dispose) g.dispose();
    if (g.geometry && g.geometry.dispose) g.geometry.dispose();
    disposeGroup(g);
  });
}
