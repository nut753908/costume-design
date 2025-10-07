import type { GUI } from "lil-gui";
import * as THREE from "three";
import { createLineMaterial } from "./line";
import { createPointsMaterial } from "./points";
import { createToonMaterial } from "./toon";

/**
 * @return  The materials.
 */
export function createMaterials(gui: GUI): Materials {
  const folder = gui.addFolder("THREE.Material");

  const points = createPointsMaterial(folder, "points", 0x000000);
  const line = createLineMaterial(folder, "line", 0x000000);

  const toonFolder = folder.addFolder("toon");
  const toon = {
    base: createToonMaterial(toonFolder, "base", 0xfef3ef, 0xfde2df),
    tube: createToonMaterial(
      toonFolder,
      "tube",
      0xe7d3cc,
      0xe3c4b7,
      THREE.DoubleSide
    ),
    area: createToonMaterial(toonFolder, "area", 0x313c43, 0x2a353c),
  };

  return {
    points,
    line,
    toon,
  };
}

export interface Materials {
  points: THREE.PointsMaterial;
  line: THREE.LineBasicMaterial;
  toon: {
    base: THREE.ShaderMaterial;
    tube: THREE.ShaderMaterial;
    area: THREE.ShaderMaterial;
  };
}
