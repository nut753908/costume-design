import * as THREE from "three";

import { createRenderer, updateRenderer } from "./main/renderer.js";
import { createCamera, updateCamera } from "./main/camera.js";
import { createControlsAndGizmo } from "./main/controls.js";
import { createScene } from "./object-3d/scene.js";
import { createAxesHelper } from "./object-3d/axes-helper.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createColor } from "./sub/color.js";
import { getToonVertex, getToonFragment } from "./sub/shader.js";
import { HairBundleGeometry } from "./geometries/HairBundleGeometry.js";

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

        const material = new THREE.ShaderMaterial({
          uniforms: {
            checkShape: { value: false },
            lightPos: { value: new THREE.Vector3(-5, 5, 5) },
            threshold: { value: 0.5 },
            baseColor: { value: createColor(0xfef3ef) },
            shadeColor: { value: createColor(0xfde2df) },
          },
          uniformsNeedUpdate: true,
          vertexShader: getToonVertex(),
          fragmentShader: getToonFragment(),
        });
        {
          const mFolder = folder.addFolder("material");
          mFolder.add(material, "wireframe");
          {
            const uFolder = mFolder.addFolder("uniforms");
            const u = material.uniforms;
            uFolder.add(u.checkShape, "value").name("checkShape");
            {
              const lpFolder = uFolder.addFolder("lightPos");
              lpFolder.add(u.lightPos.value, "x", -10, 10, 1);
              lpFolder.add(u.lightPos.value, "y", -10, 10, 1);
              lpFolder.add(u.lightPos.value, "z", -10, 10, 1);
            }
            uFolder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
            uFolder.addColor(u.baseColor, "value").name("baseColor");
            uFolder.addColor(u.shadeColor, "value").name("shadeColor");
          }
        }

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

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: createColor(0xffffff),
      transparent: true,
      opacity: 1,
    });
    {
      const lmFolder = folder.addFolder("lineMaterial");
      lmFolder.addColor(lineMaterial, "color");
      lmFolder.add(lineMaterial, "opacity", 0, 1, 0.1);
    }

    const meshMaterial = new THREE.ShaderMaterial({
      uniforms: {
        checkShape: { value: false },
        lightPos: { value: new THREE.Vector3(-5, 5, 5) },
        threshold: { value: 0.5 },
        baseColor: { value: createColor(0xfcd7e9) },
        shadeColor: { value: createColor(0xf8c1de) },
      },
      uniformsNeedUpdate: true,
      vertexShader: getToonVertex(),
      fragmentShader: getToonFragment(),
      side: THREE.DoubleSide,
    });
    {
      const mmFolder = folder.addFolder("meshMaterial");
      mmFolder.add(meshMaterial, "wireframe");
      {
        const uFolder = mmFolder.addFolder("uniforms");
        const u = meshMaterial.uniforms;
        uFolder.add(u.checkShape, "value").name("checkShape");
        {
          const lpFolder = uFolder.addFolder("lightPos");
          lpFolder.add(u.lightPos.value, "x", -10, 10, 1);
          lpFolder.add(u.lightPos.value, "y", -10, 10, 1);
          lpFolder.add(u.lightPos.value, "z", -10, 10, 1);
        }
        uFolder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
        uFolder.addColor(u.baseColor, "value").name("baseColor");
        uFolder.addColor(u.shadeColor, "value").name("shadeColor");
      }
    }

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    //

    function updateGroupGeometry(mesh, geometry) {
      mesh.children[0].geometry.dispose();
      mesh.children[1].geometry.dispose();

      mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
      mesh.children[1].geometry = geometry;
    }

    {
      const data = {
        radius: 0.5,
        height: 1,
        radialSegments: 8,
        heightSegments: 1,
      };
      function generateGeometry() {
        updateGroupGeometry(
          group,
          new HairBundleGeometry(
            data.radius,
            data.height,
            data.radialSegments,
            data.heightSegments
          )
        );
      }
      {
        const gFolder = folder.addFolder("geometry");
        gFolder.add(data, "radius", 0, 3, 0.01).onChange(generateGeometry);
        gFolder.add(data, "height", 0, 5, 0.01).onChange(generateGeometry);
        gFolder
          .add(data, "radialSegments", 3, 64, 1)
          .onChange(generateGeometry);
        gFolder
          .add(data, "heightSegments", 1, 64, 1)
          .onChange(generateGeometry);
      }
      generateGeometry();
    }

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
