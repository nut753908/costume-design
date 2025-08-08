import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
// import { createBaseGroup } from "./object-3d/group/base.js";
// import { createHairBundleGroup } from "./object-3d/group/hair-bundle.js";
// import { createControlPoint3Group } from "./object-3d/group/control-point-3.js";
// import { ControlPoint3 } from "./curve/control-point-3.js";
// import { createControlPoint2Group } from "./object-3d/group/control-point-2.js";
import { ControlPoint2 } from "./curve/control-point-2.js";
import { Curve2 } from "./curve/curve-2.js";

let renderer, camera, gizmo, scene;

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  const gui = new GUI();
  scene = createScene(gui);
  createAxesHelper(gui, scene);
  /**
   * comment out to concentrate on creating hair bundle
   */
  // await createBaseGroup(gui, scene).then((baseGroup) => {
  //   if (!baseGroup) return;
  //   createHairBundleGroup(gui, scene);
  // });
  // createHairBundleGroup(gui, scene);
  // const cp3 = new ControlPoint3();
  // createControlPoint3Group(gui, scene, cp3);
  // const cp2 = new ControlPoint2();
  // createControlPoint2Group(gui, scene, cp2);
  const cp1 = new ControlPoint2(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(-1, 0),
    new THREE.Vector2(1, 0)
  );
  const cp2 = new ControlPoint2(
    new THREE.Vector2(2, 2),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2, 3)
  );
  const cp3 = new ControlPoint2(
    new THREE.Vector2(0, 4),
    new THREE.Vector2(1, 4),
    new THREE.Vector2(-1, 4)
  );
  const cps = [cp1, cp2, cp3];
  const c = new Curve2(cps);

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
