import * as THREE from "three";

import { Edge } from "../../cross-section/edge";
import { EdgeLoop } from "../../cross-section/edge-loop";
import { EdgeLoopStack } from "../../cross-section/edge-loop-stack";
import { createLineGroup } from "./line";
import { GUI } from "lil-gui";
import { closeFolder, deleteFolder } from "../../main/gui";

/**
 * @param positions - The results of geometry.getAttribute("position").
 * @param ms - The materials.
 */
export function createLinesGroup(
  lines: {
    [k: number | string]:
      | Edge
      | EdgeLoop
      | EdgeLoopStack
      | THREE.CurvePath<THREE.Vector3>
      | THREE.CatmullRomCurve3;
  },
  positions: THREE.BufferAttribute,
  ms: { [k1: string]: { [k2: string]: THREE.Material } },
): THREE.Group {
  const group = new THREE.Group();

  Object.entries(lines).forEach(([k, v]) =>
    group.add(createLineGroup(v, positions, ms, k)),
  );

  return group;
}

/**
 * @param group - The lines group.
 */
export function setLinesGroupGUI(
  gui: GUI,
  group: THREE.Group,
  visible = false,
) {
  deleteFolder(gui, "LinesGroup");
  const folder = gui.addFolder("LinesGroup");
  // closeFolder(folder);
  const gFolder = folder.addFolder("visible");
  group.children.forEach((g) => {
    g.visible = visible;
    gFolder.add(g, "visible").name(g.name);
  });
}
