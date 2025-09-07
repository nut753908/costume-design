import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";

export function createScene(gui: GUI): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = createColor(0xffffff);
  {
    const folder = gui.addFolder("THREE.Scene").close();
    folder.addColor(scene, "background");
  }
  return scene;
}
