import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "lil-gui";
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
import { saveGui, saveClosed, loadClosed } from "./main/gui.js";
import { disposeRecursively } from "./main/dispose.js";

let renderer, camera, gizmo, scene;
let gui, ms, c, group;

let applying = false;
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

  // c = new ControlPoint3();
  // c = new ControlPoint2();
  // group = createControlPointGroup(c, ms);
  // c = screwShapedCurve3.clone();
  // c = smallCircleCurve2.clone();
  // group = createCurveGroup(c, ms);
  c = new Tube();
  group = createTubeGroup(c, ms);
  setTubeGroupGUI(gui, group); // Tube only.
  c.setGUI(gui);
  scene.add(group);

  save();
  gui.onOpenClose(save);
  gui.onFinishChange(save); // TODO: Handling calls from function type
  window.addEventListener("keydown", onWindowKeydown);
  window.addEventListener("resize", onWindowResize);
}

function save() {
  if (applying) return; // "applying" is set by applyLastUndo().

  undos.push({ c: c.toJSON(), gui: saveGui(gui), closed: saveClosed(gui) });
  redos.length = 0;
}

function applyLastUndo() {
  applying = true;

  scene.remove(group);
  disposeRecursively(group);

  const obj = undos[undos.length - 1];

  c.fromJSON(obj.c);
  // group = createControlPointGroup(c, ms);
  // group = createCurveGroup(c, ms);
  group = createTubeGroup(c, ms);
  setTubeGroupGUI(gui, group); // Tube only.
  c.setGUI(gui);
  scene.add(group);

  gui.load(obj.gui);
  loadClosed(gui, obj.closed);

  applying = false;
}

function onWindowKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === "z") {
      if (undos.length > 1) {
        redos.push(undos.pop()); // Ctrl+Z (Undo)
        applyLastUndo();
      }
      e.preventDefault();
    } else if (e.key === "Z" || e.key === "y") {
      if (redos.length > 0) {
        undos.push(redos.pop()); // Ctrl+Shift+Z or Ctrl+Y (Redo)
        applyLastUndo();
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
