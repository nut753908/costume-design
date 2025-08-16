import * as THREE from "three";

import { GUI } from "lil-gui";
import { createPointsMaterial } from "./points.js";
import { createLineMaterial } from "./line.js";
import { createToonMaterial } from "./toon.js";

/**
 * @param {GUI} gui
 * @return {{[k1:string]:{[k2:string]:THREE.Material}}} The materials.
 */
export function createMaterials(gui) {
  const folder = gui.addFolder("THREE.Material").close();

  const baseFolder = folder.addFolder("base").close();
  const base = {
    line: createLineMaterial(baseFolder, "line", 0xffffff, 0),
    toon: createToonMaterial(baseFolder, "toon", 0xfef3ef, 0xfde2df),
  };

  const cpFolder = folder.addFolder("cp").close();
  const cp = {
    points: createPointsMaterial(cpFolder, "points", 0x000000),
    line: createLineMaterial(cpFolder, "line", 0x000000),
  };

  const curveFolder = folder.addFolder("curve").close();
  const curve = {
    line: createLineMaterial(curveFolder, "line", 0x000000),
  };

  const tubeFolder = folder.addFolder("tube").close();
  const tube = {
    line: createLineMaterial(tubeFolder, "line"),
    toon: createToonMaterial(
      tubeFolder,
      "toon",
      0xfcd7e9,
      0xf8c1de,
      THREE.DoubleSide
    ),
  };

  return {
    base,
    cp,
    curve,
    tube,
  };
}
