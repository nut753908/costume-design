import { FunctionController, GUI } from "lil-gui";
import type * as THREE from "three";
import type { ViewportGizmo } from "three-viewport-gizmo";
import { createBaseCenterlines } from "./cross-section/centerline/centerline";
import {
  PlaneManager,
  type PlaneManagerJSON,
} from "./cross-section/plane/plane-manager";
import type { BufferGeometryWithNPolygonIndices } from "./geometry/base";
import { createCamera, updateCamera } from "./main/camera";
import { createControlsAndGizmo } from "./main/controls";
import {
  type closedJSON,
  type guiJSON,
  loadClosed,
  saveClosed,
  saveGui,
} from "./main/gui";
import { createRenderer, updateRenderer } from "./main/renderer";
import { disposeGroup } from "./main/utils";
import { createMaterials, type Materials } from "./material/materials";
import {
  type ArrowHelperWithCallbacks,
  createArrowHelper,
} from "./object-3d/arrow-helper";
import { createAxesHelper } from "./object-3d/axes-helper";
import { createBaseGroup } from "./object-3d/group/base";
import { createLinesGroup, setLinesGroupGUI } from "./object-3d/group/lines";
import {
  createPlaneHelper,
  type PlaneHelperWithCallbacks,
} from "./object-3d/plane-helper";
import { createScene } from "./object-3d/scene";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let gizmo: ViewportGizmo;
let scene: THREE.Scene;

let gui: GUI;
let planeHelper: PlaneHelperWithCallbacks;
let arrowHelper: ArrowHelperWithCallbacks;
let ms: Materials;

let positions: THREE.BufferAttribute;
let indices: THREE.BufferAttribute;

let pm: PlaneManager;
let planesGroup: THREE.Group;
let pointsGroup: THREE.Group;

let loading = false;
const undos: { pm: PlaneManagerJSON; gui: guiJSON; closed: closedJSON }[] = [];
const redos: { pm: PlaneManagerJSON; gui: guiJSON; closed: closedJSON }[] = [];

init();

async function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  gui = new GUI();
  {
    const folder = gui.addFolder("(fixed)");
    scene = createScene(folder);
    scene.add(createAxesHelper(folder));
    planeHelper = createPlaneHelper(folder);
    arrowHelper = createArrowHelper(folder);
    ms = createMaterials(folder);
  }

  await createBaseGroup(ms).then((baseGroup) => {
    if (!baseGroup) return;
    scene.add(baseGroup);

    if (!("geometry" in baseGroup.children[0])) return;
    const geometry = baseGroup.children[0]
      .geometry as BufferGeometryWithNPolygonIndices;
    const nPolygonIndices = geometry.nPolygonIndices;
    positions = geometry.getAttribute(
      "position"
    ) as THREE.Float32BufferAttribute;
    indices = geometry.getIndex() as THREE.BufferAttribute;

    const lines = createBaseCenterlines(nPolygonIndices, positions);
    const linesGroup = createLinesGroup(lines, positions, ms);
    setLinesGroupGUI(gui, linesGroup, false);
    scene.add(linesGroup);

    pm = new PlaneManager(lines);
    pm.setGUI(gui);
    planesGroup = pm.createPlanesGroup(gui, planeHelper, arrowHelper);
    scene.add(planesGroup);
    pointsGroup = pm.createPointsGroup(gui, positions, indices, ms);
    scene.add(pointsGroup);
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

  undos.push({ pm: pm.toJSON(), gui: saveGui(gui), closed: saveClosed(gui) });
  redos.length = 0;
}

function loadLastUndo() {
  loading = true;

  scene.remove(planesGroup);
  disposeGroup(planesGroup);
  scene.remove(pointsGroup);
  disposeGroup(pointsGroup);

  const obj = undos[undos.length - 1];

  pm.fromJSON(obj.pm);
  pm.setGUI(gui);
  planesGroup = pm.createPlanesGroup(gui, planeHelper, arrowHelper);
  scene.add(planesGroup);
  pointsGroup = pm.createPointsGroup(gui, positions, indices, ms);
  scene.add(pointsGroup);

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
