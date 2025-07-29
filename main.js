import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let renderer, camera, controls, gizmo, scene;
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
    const loader = new GLTFLoader();
    loader.load(
      "models/base1-22.glb",
      function (gltf) {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            checkShape: { value: false },
            lightPos: { value: new THREE.Vector3(-5, 5, 5) },
            threshold: { value: 0.5 },
            baseColor: { value: new THREE.Color(0xfef3f1) },
            shadeColor: { value: new THREE.Color(0xfde2df) },
          },
          uniformsNeedUpdate: true,
          vertexShader: document.getElementById("vertexShader").textContent,
          fragmentShader: document.getElementById("fragmentShader").textContent,
        });
        baseMesh = gltf.scene.children[0];
        baseMesh.material = material;
        scene.add(gltf.scene);
        {
          const folder = gui.addFolder("baseMesh");
          const mFolder = folder.addFolder("material");
          mFolder.add(material, "wireframe");
          if (material.isShaderMaterial) {
            const uFolder = mFolder.addFolder("uniforms");
            const lpFolder = uFolder.addFolder("lightPos");
            const u = material.uniforms;
            uFolder.add(u.checkShape, "value").name("checkShape");
            lpFolder.add(u.lightPos.value, "x", -10, 10, 1);
            lpFolder.add(u.lightPos.value, "y", -10, 10, 1);
            lpFolder.add(u.lightPos.value, "z", -10, 10, 1);
            uFolder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
            uFolder.addColor(u.baseColor, "value").name("baseColor");
            uFolder.addColor(u.shadeColor, "value").name("shadeColor");
          }
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
  renderer.render(scene, camera);

  gizmo.render();
}
