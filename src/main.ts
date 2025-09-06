import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer";
import { createCamera, updateCamera } from "./main/camera";
import { createControlsAndGizmo } from "./main/controls";
import { GUI, FunctionController } from "lil-gui";
import { createScene } from "./object-3d/scene";
import { createAxesHelper } from "./object-3d/axes-helper";
import { createPlaneHelper } from "./object-3d/plane-helper";
import { createArrowHelper } from "./object-3d/arrow-helper";
import { createMaterials } from "./material/materials";
import { createBaseGroup } from "./object-3d/group/base";
import { createBaseCenterlines } from "./cross-section/centerline";
import { createLinesGroup, setLinesGroupGUI } from "./object-3d/group/lines";
import { objectMap } from "./main/utils";
import { FreePlane } from "./cross-section/free-plane";
import { VerticalPlane } from "./cross-section/vertical-plane";
import { createPlanesGroup } from "./object-3d/group/planes";
import { saveGui, saveClosed, loadClosed } from "./main/gui";

let renderer, camera, gizmo, scene;
let gui, ms;

let loading = false;
const undos = [];
const redos = [];

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  gui = new GUI();
  let planeHelper, arrowHelper;
  {
    const folder = gui.addFolder("(fixed)");
    scene = createScene(folder);
    scene.add(createAxesHelper(folder));
    planeHelper = createPlaneHelper(folder);
    arrowHelper = createArrowHelper(folder);
    scene.add(planeHelper);
    scene.add(arrowHelper);
    ms = createMaterials(folder);
  }

  await createBaseGroup(ms).then((baseGroup) => {
    if (!baseGroup) return;
    scene.add(baseGroup);

    const geometry = baseGroup.children[0].geometry;
    const nPolygonIndices = geometry.nPolygonIndices;
    const positions = geometry.getAttribute("position");

    const lines = createBaseCenterlines(nPolygonIndices, positions);
    const linesGroup = createLinesGroup(lines, positions, ms);
    setLinesGroupGUI(gui, linesGroup, false);
    scene.add(linesGroup);

    // const planes = [...Array(3)].map(() => new FreePlane());
    const planes = objectMap(lines, (v) => new VerticalPlane(v));
    const planesGroup = createPlanesGroup(
      gui,
      planes,
      planeHelper,
      arrowHelper
    );
    scene.add(planesGroup);
  });

  save();
  gui.onOpenClose(save);
  gui.onChange((e) => e.controller instanceof FunctionController && save());
  gui.onFinishChange(save);
  window.addEventListener("keydown", onWindowKeydown);
  window.addEventListener("resize", onWindowResize);
}

function save() {
  if (loading) return; // "loading" is set by loadLastUndo().

  undos.push({ gui: saveGui(gui), closed: saveClosed(gui) });
  redos.length = 0;
}

function loadLastUndo() {
  loading = true;

  const obj = undos[undos.length - 1];

  gui.load(obj.gui);
  loadClosed(gui, obj.closed);

  loading = false;
}

function onWindowKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === "z") {
      if (undos.length > 1) {
        redos.push(undos.pop()); // Ctrl+Z (Undo)
        loadLastUndo();
      }
      e.preventDefault();
    } else if (e.key === "Z" || e.key === "y") {
      if (redos.length > 0) {
        undos.push(redos.pop()); // Ctrl+Shift+Z or Ctrl+Y (Redo)
        loadLastUndo();
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
