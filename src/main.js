import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createLineMaterial } from "./material/line.js";
import { createToonMaterial } from "./material/toon.js";
import { createEmptyGeometry } from "./geometry/empty.js";
import { createHairBundleGeometry } from "./geometry/hair-bundle.js";

let renderer, camera, gizmo, scene;
let baseMesh;

init();

function init() {
  renderer = createRenderer(animate);
  camera = createCamera();
  ({ gizmo } = createControlsAndGizmo(camera, renderer));

  const gui = new GUI();
  scene = createScene(gui);
  createAxesHelper(gui, scene);

  {
    const loader = new GLTFLoader();
    loader.load(
      "models/base1-22.glb",
      function (gltf) {
        baseMesh = gltf.scene.children[0];
        const folder = gui.addFolder("baseMesh");

        const material = createToonMaterial(0xfef3ef, 0xfde2df, folder);

        baseMesh.material = material;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  {
    const group = new THREE.Group();
    const folder = gui.addFolder("group");

    const geometry = createEmptyGeometry();

    const lineMaterial = createLineMaterial(folder);
    const toonMaterial = createToonMaterial(
      0xfcd7e9,
      0xf8c1de,
      folder,
      THREE.DoubleSide
    );

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, toonMaterial));

    createHairBundleGeometry(group, folder);

    scene.add(group);
  }

  //

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
