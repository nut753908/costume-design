import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
// import { createBaseGroup } from "./object-3d/group/base.js";
// import { createHairBundleGroup } from "./object-3d/group/hair-bundle.js";
import { screwShapedCurve3 } from "./curve/samples/curve-3.js";
// import { semicircleCurve2 } from "./curve/samples/curve-2.js";
import { createCurveGroup } from "./object-3d/group/curve.js";

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

  const c = screwShapedCurve3.clone();
  // const c = semicircleCurve2.clone();
  createCurveGroup(gui, c, scene);

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
