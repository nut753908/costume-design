import type { GUI } from "lil-gui";
import * as THREE from "three";
import { createLineMaterial } from "./line";
import { createPointsMaterial } from "./points";
import { createToonMaterial } from "./toon";

/**
 * @return  The materials.
 */
export function createMaterials(gui: GUI): Materials {
  const folder = gui.addFolder("THREE.Material").close();

  const baseFolder = folder.addFolder("base").close();
  const base = {
    line: createLineMaterial(baseFolder, "line", 0xffffff, 0),
    toon: createToonMaterial(baseFolder, "toon", 0xfef3ef, 0xfde2df),
  };

  const lineFolder = folder.addFolder("line").close();
  const line = {
    points: createPointsMaterial(lineFolder, "points", 0x000000),
    line: createLineMaterial(lineFolder, "line", 0x000000),
  };

  const pointsFolder = folder.addFolder("points").close();
  const points = {
    points: createPointsMaterial(pointsFolder, "points", 0x000000),
    line: createLineMaterial(pointsFolder, "line", 0x000000),
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
      0xe7d3cc,
      0xe3c4b7,
      THREE.DoubleSide
    ),
  };

  const areaFolder = folder.addFolder("area").close();
  const area = {
    line: createLineMaterial(areaFolder, "line"),
    toon: createToonMaterial(areaFolder, "toon", 0x313c43, 0x2a353c),
  };

  return {
    base,
    line,
    points,
    cp,
    curve,
    tube,
    area,
  };
}

export interface Materials {
  base: {
    line: THREE.LineBasicMaterial;
    toon: THREE.ShaderMaterial;
  };
  line: {
    points: THREE.PointsMaterial;
    line: THREE.LineBasicMaterial;
  };
  points: {
    points: THREE.PointsMaterial;
    line: THREE.LineBasicMaterial;
  };
  cp: {
    points: THREE.PointsMaterial;
    line: THREE.LineBasicMaterial;
  };
  curve: {
    line: THREE.LineBasicMaterial;
  };
  tube: {
    line: THREE.LineBasicMaterial;
    toon: THREE.ShaderMaterial;
  };
  area: {
    line: THREE.LineBasicMaterial;
    toon: THREE.ShaderMaterial;
  };
}
