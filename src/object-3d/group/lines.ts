import type { GUI } from "lil-gui";
import type { Edge } from "src/cross-section/centerline/edge";
import type { EdgeLoop } from "src/cross-section/centerline/edge-loop";
import type { EdgeLoopStack } from "src/cross-section/centerline/edge-loop-stack";
// biome-ignore lint/correctness/noUnusedImports: keep closeFolder for later use.
import { closeFolder, deleteFolder } from "src/main/gui";
import type { Materials } from "src/material/materials";
import * as THREE from "three";
import { createLineGroup } from "./line";

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
  positions: THREE.Float32BufferAttribute,
  ms: Materials
): THREE.Group {
  const group = new THREE.Group();

  Object.entries(lines).map(([k, v]) =>
    group.add(createLineGroup(v, positions, ms, k))
  );

  return group;
}

/**
 * @param group - The lines group.
 */
export function setLinesGroupGUI(
  gui: GUI,
  group: THREE.Group,
  visible = false
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
