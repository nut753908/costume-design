import type { GUI } from "lil-gui";
import { createLineMaterial } from "src/common/material/line";
import { createPointsMaterial } from "src/common/material/points";
import { createToonMaterial } from "src/common/material/toon";
import * as THREE from "three";

/**
 * @return  The materials.
 */
export function createMaterials(gui: GUI): Materials {
  const folder = gui.addFolder("THREE.Material");

  const points = createPointsMaterial(folder, "points", 0x000000);
  const line = createLineMaterial(folder, "line", 0x000000);
  const tube = createToonMaterial(
    folder,
    "tube",
    0xe7d3cc,
    0xe3c4b7,
    THREE.DoubleSide
  );

  return { points, line, tube };
}

export interface Materials {
  points: THREE.PointsMaterial;
  line: THREE.LineBasicMaterial;
  tube: THREE.ShaderMaterial;
}
