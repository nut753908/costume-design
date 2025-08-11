import * as THREE from "three";

import { Curve2 } from "../curve-2.js";
import { ControlPoint2 } from "../control-point-2.js";

export const semicircleCurve2 = new Curve2([
  new ControlPoint2(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(-1, 0),
    new THREE.Vector2(1, 0)
  ),
  new ControlPoint2(
    new THREE.Vector2(2, 2),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2, 3)
  ),
  new ControlPoint2(
    new THREE.Vector2(0, 4),
    new THREE.Vector2(1, 4),
    new THREE.Vector2(-1, 4)
  ),
]);
