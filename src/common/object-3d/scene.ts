import type { GUI } from "lil-gui";
import * as THREE from "three";
import { createColor } from "../utils";

export function createScene(gui: GUI): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = createColor(0xffffff);
  {
    const folder = gui.addFolder("THREE.Scene");
    folder.addColor(scene, "background");
  }
  return scene;
}
