import * as THREE from "three";

import { HairBundleGeometry } from "./HairBundleGeometry.js";

/**
 * @param {THREE.Object3D} mesh
 */
export function createHairBundleGeometry(mesh) {
  const data = {
    radius: 0.5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
  };
  function generateGeometry() {
    updateGroupGeometry(
      mesh,
      new HairBundleGeometry(
        data.radius,
        data.height,
        data.radialSegments,
        data.heightSegments
      )
    );
  }
  {
    const gFolder = folder.addFolder("geometry");
    gFolder.add(data, "radius", 0, 3, 0.01).onChange(generateGeometry);
    gFolder.add(data, "height", 0, 5, 0.01).onChange(generateGeometry);
    gFolder.add(data, "radialSegments", 3, 64, 1).onChange(generateGeometry);
    gFolder.add(data, "heightSegments", 1, 64, 1).onChange(generateGeometry);
  }
  generateGeometry();
}

/**
 * @param {THREE.Object3D} mesh
 * @param {THREE.BufferGeometry} geometry
 */
function updateGroupGeometry(mesh, geometry) {
  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;
}
