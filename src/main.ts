import { FunctionController, GUI } from "lil-gui";
import type * as THREE from "three";
import type { ViewportGizmo } from "three-viewport-gizmo";
import { createCamera, updateCamera } from "./common/camera";
import { createControlsAndGizmo } from "./common/controls";
import {
  type closedJSON,
  type guiJSON,
  loadClosed,
  saveClosed,
  saveGui,
} from "./common/gui";
import { createMaterials, type Materials } from "./common/material/materials";
import { createAxesHelper } from "./common/object-3d/axes-helper";
import { createScene } from "./common/object-3d/scene";
import { createRenderer, updateRenderer } from "./common/renderer";
import { disposeGroup } from "./common/utils";
import type { BufferGeometryWithNPolygonIndices } from "./hair-bundle/body/body-geometry";
import { createBodyGroup } from "./hair-bundle/body/body-group";
import { Area, type AreaJSON } from "./tight-clothing/area/area";
import { createAreaGroup } from "./tight-clothing/area/area-group";
import { createBodyCenterlines } from "./tight-clothing/centerline/centerline";
import {
  type ArrowHelperWithCallbacks,
  createArrowHelper,
} from "./tight-clothing/plane/arrow-helper";
import {
  createPlaneHelper,
  type PlaneHelperWithCallbacks,
} from "./tight-clothing/plane/plane-helper";
import {
  PlaneManager,
  type PlaneManagerJSON,
} from "./tight-clothing/plane/plane-manager";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let gizmo: ViewportGizmo;
let scene: THREE.Scene;

let gui: GUI;
let planeHelper: PlaneHelperWithCallbacks;
let arrowHelper: ArrowHelperWithCallbacks;
let ms: Materials;

let bodyGeometry: BufferGeometryWithNPolygonIndices;

let pm: PlaneManager;
let planesGroup: THREE.Group;

let area: Area;
let areaGroup: THREE.Group;

let loading = false;
const undos: {
  pm: PlaneManagerJSON;
  area: AreaJSON;
  gui: guiJSON;
  closed: closedJSON;
}[] = [];
const redos: {
  pm: PlaneManagerJSON;
  area: AreaJSON;
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
    planeHelper = createPlaneHelper(folder);
    arrowHelper = createArrowHelper(folder);
    ms = createMaterials(folder);
  }

  await createBodyGroup(ms).then((bodyGroup) => {
    if (!bodyGroup) return;
    scene.add(bodyGroup);

    if (!("geometry" in bodyGroup.children[0])) return;
    bodyGeometry = bodyGroup.children[0]
      .geometry as BufferGeometryWithNPolygonIndices;
    const nPolygonIndices = bodyGeometry.nPolygonIndices;
    const positions = bodyGeometry.getAttribute(
      "position"
    ) as THREE.Float32BufferAttribute;
    const indices = bodyGeometry.getIndex() as THREE.Uint16BufferAttribute;

    pm = new PlaneManager(createBodyCenterlines(nPolygonIndices, positions));
    pm.setGUI(gui);
    planesGroup = pm.createPlanesGroup(planeHelper, arrowHelper);
    scene.add(planesGroup);

    area = new Area(Area.createIndicesObj(positions, indices));
    pm._addCrossSection = area.addCrossSection.bind(area);
    pm._removeCrossSection = area.removeCrossSection.bind(area);
    pm._updateCrossSection = area.updateCrossSection.bind(area);
    area.setGUI(gui);
    areaGroup = createAreaGroup(area, bodyGeometry, ms);
    scene.add(areaGroup);
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

  undos.push({
    pm: pm.toJSON(),
    area: area.toJSON(),
    gui: saveGui(gui),
    closed: saveClosed(gui),
  });
  redos.length = 0;
}

function loadLastUndo() {
  loading = true;

  scene.remove(planesGroup);
  disposeGroup(planesGroup);

  scene.remove(areaGroup);
  disposeGroup(areaGroup);

  const obj = undos[undos.length - 1];

  pm.fromJSON(obj.pm);
  pm.setGUI(gui);
  planesGroup = pm.createPlanesGroup(planeHelper, arrowHelper);
  scene.add(planesGroup);

  area.fromJSON(obj.area);
  area.setGUI(gui);
  areaGroup = createAreaGroup(area, bodyGeometry, ms);
  scene.add(areaGroup);

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
