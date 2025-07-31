import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

/**
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @return {{controls: OrbitControls, gizmo: ViewportGizmo}}
 */
export function createControlsAndGizmo(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  const gizmo = new ViewportGizmo(camera, renderer, { offset: { right: 280 } });
  gizmo.attachControls(controls);

  return { controls, gizmo };
}
