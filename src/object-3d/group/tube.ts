import * as THREE from "three";

import type { Tube } from "../../curve/tube";
import { createCurveGroup } from "./curve";
import { createEmptyGeometry } from "../../geometry/empty";
import type { GUI } from "lil-gui";
import { deleteFolder } from "../../main/gui";

/**
 * @param ms - The materials.
 */
export function createTubeGroup(
  t: Tube,
  ms: { [k1: string]: { [k2: string]: THREE.Material } },
): THREE.Group {
  const group = new THREE.Group();

  const p = t.parameters;

  group.add(createTubeGroupWithNoCurves(t, ms));
  group.add(createCurveGroup(p.axis, ms));
  group.add(createCurveGroup(p.cross, ms));
  group.add(createCurveGroup(p.scaleC, ms));
  group.add(createCurveGroup(p.xScaleC, ms));
  group.add(createCurveGroup(p.yScaleC, ms));
  group.add(createCurveGroup(p.xCurvatureC, ms));
  group.add(createCurveGroup(p.yCurvatureC, ms));
  group.add(createCurveGroup(p.tiltC, ms));

  return group;
}

/**
 * @param ms - The materials.
 */
function createTubeGroupWithNoCurves(
  t: Tube,
  ms: { [k1: string]: { [k2: string]: THREE.Material } },
): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.LineSegments(geometry, ms.tube.line));
  group.add(new THREE.Mesh(geometry, ms.tube.toon));

  t.createGeometry(group);

  return group;
}

/**
 * @param group - The tube group.
 */
export function setTubeGroupGUI(gui: GUI, group: THREE.Group) {
  deleteFolder(gui, "TubeGroup");
  const folder = gui.addFolder("TubeGroup");
  const gFolder = folder.addFolder("visible");
  const names = [
    "tube",
    "axis",
    "cross",
    "scaleC",
    "xScaleC",
    "yScaleC",
    "xCurvatureC",
    "yCurvatureC",
    "tiltC",
  ];
  group.children.forEach((g, i) => {
    if (i !== 0) g.visible = false;
    gFolder.add(g, "visible").name(names[i]);
  });
}
