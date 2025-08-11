import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
// import { createBaseGroup } from "./object-3d/group/base.js";
// import { createHairBundleGroup } from "./object-3d/group/hair-bundle.js";
import { screwShapedCurve3 } from "./curve/samples/curve-3.js";
import { smallCircleCurve2 } from "./curve/samples/curve-2.js";
// import { createCurveGroup } from "./object-3d/group/curve.js";
import { TubeGeometry } from "./geometry/tube.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";

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

  // const c = screwShapedCurve3.clone();
  // const c = smallCircleCurve2.clone();
  // createCurveGroup(gui, c, scene);

  const axis = screwShapedCurve3.clone();
  const cross = smallCircleCurve2.clone();
  const geometry = new TubeGeometry(axis, cross, 12, 8, 1, 1, 1, 0);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const normalshelper = new VertexNormalsHelper(mesh, 0.05, 0xff0000);
  scene.add(normalshelper);

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
