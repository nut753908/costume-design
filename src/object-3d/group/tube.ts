import type { GUI } from "lil-gui";
import { createEmptyGeometry } from "src/geometry/empty";
import type { Tube } from "src/hair-bundle/tube";
import { deleteFolder } from "src/main/gui";
import type { Materials } from "src/material/materials";
import * as THREE from "three";
import { createCurveGroup } from "./curve";

/**
 * @param ms - The materials.
 */
export function createTubeGroup(t: Tube, ms: Materials): THREE.Group {
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
function createTubeGroupWithNoCurves(t: Tube, ms: Materials): THREE.Group {
  const group = new THREE.Group();

  const geometry = createEmptyGeometry();

  group.add(new THREE.Mesh(geometry, ms.toon.tube));

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
