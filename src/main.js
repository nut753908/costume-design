import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
// import { createBaseGroup } from "./object-3d/group/base.js";
// import { screwShapedCurve3 } from "./curve/samples/curve-3.js";
// import { smallCircleCurve2 } from "./curve/samples/curve-2.js";
// import { createCurveGroup } from "./object-3d/group/curve.js";
import { Tube } from "./curve/tube.js";
import { createTubeGroup } from "./object-3d/group/tube.js";

let renderer, camera, gizmo, scene;

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  const gui = new GUI();
  scene = createScene(gui);
  scene.add(createAxesHelper(gui));

  // await createBaseGroup(gui).then((baseGroup) => {
  //   if (!baseGroup) return;
  //   scene.add(baseGroup);
  // });

  // const c = screwShapedCurve3.clone();
  // const c = smallCircleCurve2.clone();
  // scene.add(createCurveGroup(gui, c));

  const t = new Tube();
  scene.add(createTubeGroup(gui, t));

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
