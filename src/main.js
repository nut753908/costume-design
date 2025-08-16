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
import { pickStaticFolders, saveClosed, loadClosed } from "./main/gui.js";
import { disposeRecursively } from "./object-3d/group/dispose.js";

let renderer, camera, gizmo, scene;
let gui, ms, cp, cpGroup, c, cGroup, t, tGroup;

let applying = false;
let closedObj;
const undos = [];
const redos = [];

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  gui = new GUI();
  scene = createScene(gui);
  scene.add(createAxesHelper(gui));

  ms = createMaterials(gui);

  // await createBaseGroup(ms).then((baseGroup) => {
  //   if (!baseGroup) return;
  //   scene.add(baseGroup);
  // });

  // cp = new ControlPoint3();
  // cp = new ControlPoint2();
  // cpGroup = createControlPointGroup(cp, ms);
  // scene.add(cpGroup);
  // cp.setGUI(gui);

  // c = screwShapedCurve3.clone();
  // c = smallCircleCurve2.clone();
  // cGroup = createCurveGroup(c, ms);
  // scene.add(cGroup);
  // c.setGUI(gui);

  t = new Tube();
  tGroup = createTubeGroup(t, ms);
  scene.add(tGroup);
  setTubeGroupGUI(gui, tGroup);
  t.setGUI(gui);

  save();
  gui.onFinishChange(save);
  window.addEventListener("keydown", onWindowKeydown);
  window.addEventListener("resize", onWindowResize);
}

function save() {
  if (applying) return; // "applying" is set by applyLastUndos().

  const guiObj = gui.save();
  guiObj.folders = pickStaticFolders(guiObj);

  closedObj = saveClosed(gui);

  undos.push({
    // cp: cp.toJSON(),
    // c: c.toJSON(),
    t: t.toJSON(),
    gui: guiObj,
  });
  redos.length = 0;
}

function applyLastUndos() {
  applying = true;

  // scene.remove(cpGroup);
  // scene.remove(cGroup);
  scene.remove(tGroup);

  // disposeRecursively(cpGroup);
  // disposeRecursively(cGroup);
  disposeRecursively(tGroup);

  const obj = undos[undos.length - 1];
  {
    // cp.fromJSON(obj.cp);
    // cpGroup = createControlPointGroup(cp, ms);
    // scene.add(cpGroup);
    // cp.setGUI(gui);

    // c.fromJSON(obj.c);
    // cGroup = createCurveGroup(c, ms);
    // scene.add(cGroup);
    // c.setGUI(gui);

    t.fromJSON(obj.t);
    tGroup = createTubeGroup(t, ms);
    scene.add(tGroup);
    setTubeGroupGUI(gui, tGroup);
    t.setGUI(gui);
  }
  gui.load(obj.gui);
  loadClosed(gui, closedObj);

  applying = false;
}

function onWindowKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === "z") {
      // Ctrl+Z (Undo)
      if (undos.length > 1) {
        redos.push(undos.pop());
        applyLastUndos();
      }
      e.preventDefault();
    } else if (e.key === "Z" || e.key === "y") {
      // Ctrl+Shift+Z or Ctrl+Y (Redo)
      if (redos.length > 0) {
        undos.push(redos.pop());
        applyLastUndos();
      }
      e.preventDefault();
    }
  }
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
