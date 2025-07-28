import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let renderer, camera, controls, gizmo, scene;
let light, lightHelper;
let light2, lightHelper2;
let baseMesh;

const frustumSize = 2;

init();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    -(frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );
  camera.position.z = 5;

  controls = new OrbitControls(camera, renderer.domElement);

  gizmo = new ViewportGizmo(camera, renderer, { offset: { right: 280 } });
  gizmo.attachControls(controls);

  //

  const gui = new GUI();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  {
    const helper = new THREE.AxesHelper(3);
    scene.add(helper);
    const folder = gui.addFolder("THREE.AxesHelper");
    folder.add(helper, "visible");
  }

  {
    light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);
    const folder = gui.addFolder("THREE.DirectionalLight (front)");
    folder.add(light, "intensity", 0, 10, 1);
    const posFolder = folder.addFolder("position");
    posFolder.add(light.position, "x", -10, 10, 1);
    posFolder.add(light.position, "y", -10, 10, 1);
    posFolder.add(light.position, "z", -10, 10, 1);
  }
  {
    lightHelper = new THREE.DirectionalLightHelper(light, 1);
    lightHelper.visible = false;
    scene.add(lightHelper);
    const folder = gui.addFolder("THREE.DirectionalLightHelper (front)");
    folder.add(lightHelper, "visible");
  }

  {
    light2 = new THREE.DirectionalLight(0xffffff, 0);
    light2.position.set(1, -2, -4);
    scene.add(light2);
    const folder = gui.addFolder("THREE.DirectionalLight (back)");
    folder.add(light2, "intensity", 0, 10, 1);
  }
  {
    lightHelper2 = new THREE.DirectionalLightHelper(light2, 1);
    lightHelper2.visible = false;
    scene.add(lightHelper2);
    const folder = gui.addFolder("THREE.DirectionalLightHelper (back)");
    folder.add(lightHelper2, "visible");
  }

  {
    const loader = new GLTFLoader();
    loader.load(
      "models/base1-22.glb",
      function (gltf) {
        const material = new THREE.MeshToonMaterial({ color: 0xfef3f1 });
        // const material = new THREE.MeshNormalMaterial();
        baseMesh = gltf.scene.children[0];
        baseMesh.material = material;
        scene.add(gltf.scene);
        {
          const folder = gui.addFolder("THREE.Material");
          folder.addColor(baseMesh.material, "color");
          folder.add(baseMesh.material, "wireframe");
        }
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -(frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  gizmo.update();
}

function animate() {
  light2.position.x = -light.position.x;
  light2.position.y = -light.position.y;
  light2.position.z = -light.position.z;
  lightHelper.update();
  lightHelper2.update();

  renderer.render(scene, camera);

  gizmo.render();
}
