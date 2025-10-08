import { FunctionController, GUI } from "lil-gui";
import { createCamera, updateCamera } from "src/common/camera";
import { createControlsAndGizmo } from "src/common/controls";
import {
  type closedJSON,
  type guiJSON,
  loadClosed,
  saveClosed,
  saveGui,
} from "src/common/gui";
import { createAxesHelper } from "src/common/object-3d/axes-helper";
import { createScene } from "src/common/object-3d/scene";
import { createRenderer, updateRenderer } from "src/common/renderer";
import { disposeGroup } from "src/common/utils";
import type * as THREE from "three";
import type { ViewportGizmo } from "three-viewport-gizmo";
import { createMaterials, type Materials } from "./materials";
import { Tube } from "./tube/tube";
import type { TubeGeometryParametersJSON } from "./tube/tube-geometry";
import { createTubeGroup, setTubeGroupGUI } from "./tube/tube-group";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let gizmo: ViewportGizmo;
let scene: THREE.Scene;

let gui: GUI;
let ms: Materials;

let tube: Tube;
let tubeGroup: THREE.Group;

let loading = false;
const undos: {
  tube: TubeGeometryParametersJSON;
  gui: guiJSON;
  closed: closedJSON;
}[] = [];
const redos: {
  tube: TubeGeometryParametersJSON;
  gui: guiJSON;
  closed: closedJSON;
}[] = [];

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  gui = new GUI();
  {
    const folder = gui.addFolder("common").close();
    scene = createScene(folder);
    scene.add(createAxesHelper(folder));
    ms = createMaterials(folder);
  }

  tube = new Tube();
  tubeGroup = createTubeGroup(tube, ms);
  setTubeGroupGUI(gui, tubeGroup);
  tube.setGUI(gui);
  scene.add(tubeGroup);

  save();
  gui.onOpenClose(save);
  gui.onChange((e) => e.controller instanceof FunctionController && save());
  gui.onFinishChange(save);
  window.addEventListener("keydown", onWindowKeydown);
  window.addEventListener("resize", onWindowResize);
}

function save() {
  if (loading) return; // "loading" is set by loadLastUndo().

  undos.push({
    tube: tube.toJSON(),
    gui: saveGui(gui),
    closed: saveClosed(gui),
  });
  redos.length = 0;
}

function loadLastUndo() {
  loading = true;

  scene.remove(tubeGroup);
  disposeGroup(tubeGroup);

  const obj = undos[undos.length - 1];

  tube.fromJSON(obj.tube);
  tubeGroup = createTubeGroup(tube, ms);
  setTubeGroupGUI(gui, tubeGroup);
  tube.setGUI(gui);
  scene.add(tubeGroup);

  gui.load(obj.gui);
  loadClosed(gui, obj.closed);

  loading = false;
}

function onWindowKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === "z") {
      e.preventDefault();
      // Ctrl+Z (Undo)
      if (undos.length <= 1) return;
      const obj = undos.pop();
      if (obj === undefined) return;
      redos.push(obj);
      loadLastUndo();
    } else if (e.key === "Z" || e.key === "y") {
      e.preventDefault();
      // Ctrl+Shift+Z or Ctrl+Y (Redo)
      if (redos.length === 0) return;
      const obj = redos.pop();
      if (obj === undefined) return;
      undos.push(obj);
      loadLastUndo();
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
