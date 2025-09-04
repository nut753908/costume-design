import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI, FunctionController } from "lil-gui";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
import { createPlaneHelper } from "./object-3d/plane-helper.js";
import { createArrowHelper } from "./object-3d/arrow-helper.js";
import { createMaterials } from "./material/materials.js";
import { createBaseGroup } from "./object-3d/group/base.js";
import { createAllEdges } from "./cross-section/edges.js";
import { createAllEdgeLoops } from "./cross-section/edge-loops.js";
import { createAllEdgeLoopStacks } from "./cross-section/edge-loop-stacks.js";
import { getCentroids } from "./cross-section/points.js";
import { createLinePath } from "./cross-section/line-path.js";
import { createEdgesGroup, setEdgesGroupGUI } from "./object-3d/group/edges.js";
import { FreePlane } from "./cross-section/free-plane.js";
import { VerticalPlane } from "./cross-section/vertical-plane.js";
import { createPlanesGroup } from "./object-3d/group/planes.js";
import { ControlPoint3 } from "./curve/control-point-3.js";
import { ControlPoint2 } from "./curve/control-point-2.js";
import { createControlPointGroup } from "./object-3d/group/control-point.js";
import { screwShapedCurve3 } from "./curve/samples/curve-3.js";
import { smallCircleCurve2 } from "./curve/samples/curve-2.js";
import { createCurveGroup } from "./object-3d/group/curve.js";
import { Tube } from "./curve/tube.js";
import { createTubeGroup, setTubeGroupGUI } from "./object-3d/group/tube.js";
import { saveGui, saveClosed, loadClosed } from "./main/gui.js";
import { disposeGroup } from "./main/dispose.js";

let renderer, camera, gizmo, scene;
let gui, ms, c, group;

let loading = false;
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
  const planeHelper = createPlaneHelper(gui);
  const arrowHelper = createArrowHelper(gui);
  scene.add(planeHelper);
  scene.add(arrowHelper);
  ms = createMaterials(gui);

  await createBaseGroup(ms).then((baseGroup) => {
    if (!baseGroup) return;
    scene.add(baseGroup);

    const geometry = baseGroup.children[0].geometry;
    const nPolygonIndices = geometry.nPolygonIndices;
    const positions = geometry.getAttribute("position");

    let edges;
    // edges = createAllEdges(nPolygonIndices);
    // edges = createAllEdgeLoops(nPolygonIndices);
    edges = createAllEdgeLoopStacks(nPolygonIndices);
    edges = edges.map((e) => {
      const points = e.getPoints(positions);
      const centroids = getCentroids(points);
      return createLinePath(centroids);
    });
    const edgesGroup = createEdgesGroup(edges, positions, ms);
    setEdgesGroupGUI(gui, edgesGroup, false);
    scene.add(edgesGroup);

    console.log(edges);
    console.log(edges.map((e) => e.getPoints(positions)));

    // const planes = [...Array(3)].map(() => new FreePlane());
    const planes = edges.map((e) => new VerticalPlane(e));
    const planesGroup = createPlanesGroup(
      gui,
      planes,
      planeHelper,
      arrowHelper
    );
    scene.add(planesGroup);
  });

  // c = new ControlPoint3();
  // c = new ControlPoint2();
  // group = createControlPointGroup(c, ms);
  // c = screwShapedCurve3.clone();
  // c = smallCircleCurve2.clone();
  // group = createCurveGroup(c, ms);
  c = new Tube();
  group = createTubeGroup(c, ms);
  group.children[0].visible = false; // debug code
  setTubeGroupGUI(gui, group); // Tube only.
  c.setGUI(gui);
  scene.add(group);

  save();
  gui.onOpenClose(save);
  gui.onChange((e) => e.controller instanceof FunctionController && save());
  gui.onFinishChange(save);
  window.addEventListener("keydown", onWindowKeydown);
  window.addEventListener("resize", onWindowResize);
}

function save() {
  if (loading) return; // "loading" is set by loadLastUndo().

  undos.push({ c: c.toJSON(), gui: saveGui(gui), closed: saveClosed(gui) });
  redos.length = 0;
}

function loadLastUndo() {
  loading = true;

  scene.remove(group);
  disposeGroup(group);

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
