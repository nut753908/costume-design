import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
import { createMaterials } from "./material/materials.js";
import { createBaseGroup } from "./object-3d/group/base.js";
import { ControlPoint3 } from "./curve/control-point-3.js";
import { ControlPoint2 } from "./curve/control-point-2.js";
import { createControlPointGroup } from "./object-3d/group/control-point.js";
import { screwShapedCurve3 } from "./curve/samples/curve-3.js";
import { smallCircleCurve2 } from "./curve/samples/curve-2.js";
import { createCurveGroup } from "./object-3d/group/curve.js";
import { Tube } from "./curve/tube.js";
import { createTubeGroup, setTubeGroupGUI } from "./object-3d/group/tube.js";

let renderer, camera, gizmo, scene;

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  const gui = new GUI();
  scene = createScene(gui);
  scene.add(createAxesHelper(gui));

  const ms = createMaterials(gui);

  // await createBaseGroup(ms).then((baseGroup) => {
  //   if (!baseGroup) return;
  //   scene.add(baseGroup);
  // });

  // const cp = new ControlPoint3();
  // const cp = new ControlPoint2();
  // scene.add(createControlPointGroup(cp, ms));
  // cp.setGUI(gui);

  // const c = screwShapedCurve3.clone();
  // const c = smallCircleCurve2.clone();
  // scene.add(createCurveGroup(c, ms));
  // c.setGUI(gui);

  const t = new Tube();
  const group = createTubeGroup(t, ms);
  scene.add(group);
  setTubeGroupGUI(gui, group);
  t.setGUI(gui);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  updateCamera(camera);
  updateRenderer(renderer);
  gizmo.update();
}

function animate() {
  renderer.render(scene, camera);
  gizmo.render();
}
