import type * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ViewportGizmo } from "three-viewport-gizmo";

export function createControlsAndGizmo(
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): { controls: OrbitControls; gizmo: ViewportGizmo } {
  const controls = new OrbitControls(camera, renderer.domElement);

  const gizmo = new ViewportGizmo(camera, renderer, { offset: { right: 280 } });
  gizmo.attachControls(controls);

  return { controls, gizmo };
}
