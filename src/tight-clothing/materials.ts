import type { GUI } from "lil-gui";
import { createLineMaterial } from "src/common/material/line";
import { createPointsMaterial } from "src/common/material/points";
import { createToonMaterial } from "src/common/material/toon";
import type * as THREE from "three";

/**
 * @return  The materials.
 */
export function createMaterials(gui: GUI): Materials {
  const folder = gui.addFolder("THREE.Material");

  const points = createPointsMaterial(folder, "points", 0x000000, true);
  const line = createLineMaterial(folder, "line", 0x000000, true);
  const body = createToonMaterial(folder, "body", 0xfef3ef, 0xfde2df);
  const area = createToonMaterial(folder, "area", 0x313c43, 0x2a353c);

  return { points, line, body, area };
}

export interface Materials {
  points: THREE.PointsMaterial;
  line: THREE.LineBasicMaterial;
  body: THREE.ShaderMaterial;
  area: THREE.ShaderMaterial;
}
