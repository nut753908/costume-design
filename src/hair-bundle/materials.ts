import type { GUI } from "lil-gui";
import { createToonMaterial } from "src/common/material/toon";
import type * as THREE from "three";

/**
 * @return  The materials.
 */
export function createMaterials(gui: GUI): Materials {
  const folder = gui.addFolder("THREE.Material");

  const body = createToonMaterial(folder, "body", 0xfef3ef, 0xfde2df);
  const area = createToonMaterial(folder, "area", 0x313c43, 0x2a353c);

  return { body, area };
}

export interface Materials {
  body: THREE.ShaderMaterial;
  area: THREE.ShaderMaterial;
}
