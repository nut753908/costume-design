import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI, FunctionController } from "lil-gui";
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
import { createAllEdges, findDiagonals } from "./cross-section/edges.js";
import { createRemainingVerticesMap } from "./cross-section/vertices.js";
import { createAllEdgeLoops } from "./cross-section/edge-loops.js";
import { createAllEdgeLoopStacks } from "./cross-section/edge-loop-stacks.js";
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
  ms = createMaterials(gui);

  await createBaseGroup(ms).then((baseGroup) => {
    if (!baseGroup) return;
    scene.add(baseGroup);

    // TODO: correctly treat triangle polygons like quad polygons.
    // start the debug code
    const geometry = baseGroup.children[1].geometry;
    const indices = geometry.getIndex();
    const vertices = geometry.getAttribute("position");
    const allEdges = createAllEdges(indices);
    const map = createRemainingVerticesMap(indices);
    const list = findDiagonals(allEdges, map, vertices);
    // const list = createAllEdgeLoops(indices);
    // const list = createAllEdgeLoopStacks(indices);
    const group2 = new THREE.Group();
    const folder = gui.addFolder("test");
    list.map((v, i) => {
      const _geometry = new THREE.BufferGeometry().setFromPoints(
        v.getPoints(vertices)
      );
      const _group = new THREE.Group();
      // _group.add(new THREE.Points(_geometry, ms.cp.points));
      _group.add(new THREE.Line(_geometry, ms.cp.line));
      group2.add(_group);
      // _group.visible = false;
      folder.add(_group, "visible").name(i);
    });
    scene.add(group2);
    console.log(list);
    console.log(list.map((v) => v.getPoints(vertices)));
    // end the debug code
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
