import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HairBundleGeometry } from "./geometries/HairBundleGeometry.js";

let renderer, camera, controls, gizmo, scene;
let baseMesh;

const frustumSize = 2;

init();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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

  {
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHex(
      0xffffff,
      THREE.LinearSRGBColorSpace
    );
    const folder = gui.addFolder("THREE.Scene");
    folder.addColor(scene, "background");
  }

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
            baseColor: {
              value: new THREE.Color().setHex(
                0xfef3ef,
                THREE.LinearSRGBColorSpace
              ),
            },
            shadeColor: {
              value: new THREE.Color().setHex(
                0xfde2df,
                THREE.LinearSRGBColorSpace
              ),
            },
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
            const u = material.uniforms;
            uFolder.add(u.checkShape, "value").name("checkShape");
            const lpFolder = uFolder.addFolder("lightPos");
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

  {
    const group = new THREE.Group();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHex(0xffffff, THREE.LinearSRGBColorSpace),
      transparent: true,
      opacity: 1,
    });
    const meshMaterial = new THREE.ShaderMaterial({
      uniforms: {
        checkShape: { value: false },
        lightPos: { value: new THREE.Vector3(-5, 5, 5) },
        threshold: { value: 0.5 },
        baseColor: {
          value: new THREE.Color().setHex(0xfcd7e9, THREE.LinearSRGBColorSpace),
        },
        shadeColor: {
          value: new THREE.Color().setHex(0xf8c1de, THREE.LinearSRGBColorSpace),
        },
      },
      uniformsNeedUpdate: true,
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      side: THREE.DoubleSide,
    });

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    //

    function updateGroupGeometry(mesh, geometry) {
      mesh.children[0].geometry.dispose();
      mesh.children[1].geometry.dispose();

      mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
      mesh.children[1].geometry = geometry;
    }

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
    generateGeometry();

    scene.add(group);

    {
      const folder = gui.addFolder("group");
      const gFolder = folder.addFolder("geometry");
      gFolder.add(data, "radius", 0, 3, 0.01).onChange(generateGeometry);
      gFolder.add(data, "height", 0, 5, 0.01).onChange(generateGeometry);
      gFolder.add(data, "radialSegments", 3, 64, 1).onChange(generateGeometry);
      gFolder.add(data, "heightSegments", 1, 64, 1).onChange(generateGeometry);
      const lmFolder = folder.addFolder("lineMaterial");
      lmFolder.addColor(lineMaterial, "color");
      lmFolder.add(lineMaterial, "opacity", 0, 1, 0.1);
      const mmFolder = folder.addFolder("meshMaterial");
      mmFolder.add(meshMaterial, "wireframe");
      if (meshMaterial.isShaderMaterial) {
        const uFolder = mmFolder.addFolder("uniforms");
        const u = meshMaterial.uniforms;
        uFolder.add(u.checkShape, "value").name("checkShape");
        const lpFolder = uFolder.addFolder("lightPos");
        lpFolder.add(u.lightPos.value, "x", -10, 10, 1);
        lpFolder.add(u.lightPos.value, "y", -10, 10, 1);
        lpFolder.add(u.lightPos.value, "z", -10, 10, 1);
        uFolder.add(u.threshold, "value", 0, 1, 0.1).name("threshold");
        uFolder.addColor(u.baseColor, "value").name("baseColor");
        uFolder.addColor(u.shadeColor, "value").name("shadeColor");
      }
    }
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
